import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';
import { getCurrentQRHardwareState } from '../../selectors';

export default () => {
  const qrHardware = useSelector(getCurrentQRHardwareState);
  const dispatch = useDispatch();
  const showQRHardwareWalletImporter = useCallback(() => dispatch(actions.showQRHardwareWalletImporter()), []);
  const { sync } = qrHardware;
  useEffect(() => {
    if (sync.reading) {
      showQRHardwareWalletImporter();
    }
  }, [sync.reading]);

  return null;
}
