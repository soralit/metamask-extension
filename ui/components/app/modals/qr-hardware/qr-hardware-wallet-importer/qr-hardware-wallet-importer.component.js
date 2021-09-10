import React, { useCallback } from 'react';
import {
  cancelReadQRHardwareCryptoHDKey as cancelReadQRHardwareCryptoHDKeyAction,
  submitQRHardwareCryptoHDKey,
  hideModal as hideModalAction,
} from '../../../../../store/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BaseReader from '../base-reader';

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const hideModal = useCallback(() => dispatch(hideModalAction()), []);
  const cancelReadQRHardwareCryptoHDKey = useCallback(() => dispatch(cancelReadQRHardwareCryptoHDKeyAction()), []);

  const cancel = () => {
    hideModal();
    cancelReadQRHardwareCryptoHDKey();
    history.goBack();
  };

  const handleSuccess = (ur) => {
    return new Promise((resolve, reject) => {
      if (ur.type !== 'crypto-hdkey') {
        reject('invalid qr hardware wallet data');
      }
      submitQRHardwareCryptoHDKey(ur.cbor.toString('hex')).then(resolve).catch(reject);
    });
  };


  return (
    <BaseReader handleCancel={cancel} handleSuccess={handleSuccess} />
  );
}
