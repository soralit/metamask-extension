import React, { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import { getEnvironmentType } from '../../../../../app/scripts/lib/util';
import { ENVIRONMENT_TYPE_FULLSCREEN } from '../../../../../shared/constants/app';
import WebcamUtils from '../../../../helpers/utils/webcam-utils';
import PageContainerFooter from '../../../ui/page-container/page-container-footer/page-container-footer.component';
import { URDecoder } from '@ngraveio/bc-ur';
import QrReader from 'react-qr-reader';
import {
  hideModal as hideModalAction,
} from '../../../../store/actions';
import { useDispatch } from 'react-redux';
import { useI18nContext } from '../../../../hooks/useI18nContext';

const READY_STATE = {
  ACCESSING_CAMERA: 'ACCESSING_CAMERA',
  NEED_TO_ALLOW_ACCESS: 'NEED_TO_ALLOW_ACCESS',
  READY: 'READY',
};

export default ({ handleCancel, handleSuccess }) => {
  const dispatch = useDispatch();
  const t = useI18nContext();
  const hideModal = useCallback(() => dispatch(hideModalAction()), []);
  const [ready, setReady] = useState(READY_STATE.ACCESSING_CAMERA);
  const [error, setError] = useState(null);
  const [urDecoder, setURDecoder] = useState(new URDecoder());
  let permissionChecker = null;
  let mounted = false;

  const reset = () => {
    setReady(READY_STATE.ACCESSING_CAMERA);
    setError(null);
    setURDecoder(new URDecoder());
  };

  useEffect(() => {
    mounted = true;
    checkEnvironment();
    return () => {
      mounted = false;
      clearTimeout(permissionChecker);
    };
  }, []);

  useEffect(() => {
    if (ready === READY_STATE.READY) {
      initCamera();
    } else if (ready === READY_STATE.NEED_TO_ALLOW_ACCESS) {
      checkPermissions();
    }
  }, [ready]);

  const checkEnvironment = async () => {
    try {
      const { environmentReady } = await WebcamUtils.checkStatus();
      if (
        !environmentReady &&
        getEnvironmentType() !== ENVIRONMENT_TYPE_FULLSCREEN
      ) {
        const currentUrl = new URL(window.location.href);
        const currentHash = currentUrl.hash;
        const currentRoute = currentHash ? currentHash.substring(1) : null;
        global.platform.openExtensionInBrowser(currentRoute);
      }
    } catch (error) {
      if (mounted) {
        setError({ error });
      }
    }
    // initial attempt is required to trigger permission prompt
    initCamera();
  };

  const checkPermissions = async () => {
    try {
      const { permissions } = await WebcamUtils.checkStatus();
      if (permissions) {
        // Let the video stream load first...
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!mounted) {
          return;
        }
        setReady(READY_STATE.READY);
      } else if (mounted) {
        // Keep checking for permissions
        permissionChecker = setTimeout(checkPermissions, 1000);
      }
    } catch (error) {
      if (mounted) {
        setError(error);
      }
    }
  };

  const initCamera = async () => {
    try {
      await checkPermissions();
    } catch (error) {
      if (!mounted) {
        return;
      }
      if (error.name === 'NotAllowedError') {
        log.info(`Permission denied: '${error}'`);
        setReady(READY_STATE.NEED_TO_ALLOW_ACCESS);
      } else {
        setError(error);
      }
    }
  };

  const stopAndClose = () => {
    hideModal();
    history.goBack();
  };

  const tryAgain = () => {
    clearTimeout(permissionChecker);
    reset();
    checkEnvironment();
  };

  const handleError = (error) => {
    setError(error);
  };

  const handleScan = (data) => {
    try {
      if (!data) {
        return;
      }
      urDecoder.receivePart(data);
      if (urDecoder.isComplete()) {
        const result = urDecoder.resultUR();
        handleSuccess(result).then(() => stopAndClose()).catch(setError());
      }
    } catch (error) {
      setError(error);
    }
  };

  const renderError = () => {
    let title, msg;
    if (error.type === 'NO_WEBCAM_FOUND') {
      title = t('noWebcamFoundTitle');
      msg = t('noWebcamFound');
    } else if (error.message === t('unknownQrCode')) {
      msg = t('unknownQrCode');
    } else {
      title = t('unknownCameraErrorTitle');
      msg = t('unknownCameraError');
    }

    return (
      <>
        <div className='qr-scanner__image'>
          <img src='images/webcam.svg' width='70' height='70' alt='' />
        </div>
        {title ? <div className='qr-scanner__title'>{title}</div> : null}
        <div className='qr-scanner__error'>{msg}</div>
        <PageContainerFooter
          onCancel={handleCancel}
          onSubmit={tryAgain}
          cancelText={t('cancel')}
          submitText={t('tryAgain')}
          submitButtonType='confirm'
        />
      </>
    );
  };

  const renderVideo = () => {
    let message;
    if (ready === READY_STATE.ACCESSING_CAMERA) {
      message = t('accessingYourCamera');
    } else if (ready === READY_STATE.READY) {
      message = t('scanInstructions');
    } else if (ready === READY_STATE.NEED_TO_ALLOW_ACCESS) {
      message = t('youNeedToAllowCameraAccess');
    }

    return (
      <>
        <div className='qr-scanner__title'>{`${t('scanQrCode')}`}</div>
        <div className='qr-scanner__content'>
          <div className='qr-scanner__content__video-wrapper'>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className='qr-scanner__status'>{message}</div>
      </>
    );
  };

  return (
    <div className='qr-scanner'>
      <div className='qr-scanner__close' onClick={handleCancel} />
      {error ? renderError() : renderVideo()}
    </div>
  );

}
