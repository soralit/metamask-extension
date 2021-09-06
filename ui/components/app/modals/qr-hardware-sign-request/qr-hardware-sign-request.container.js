import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  submitQRHardwareSignature,
  hideModal,
  cancelQRHardwareSignRequest,
} from '../../../../store/actions';
import QRHardwareSignRequest from './qr-hardware-sign-request.component';

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => {
      dispatch(hideModal());
    },
    submitQRHardwareSignature: (requestId, cbor) =>
      submitQRHardwareSignature(requestId, cbor),
    cancelQRHardwareSignRequest: () => dispatch(cancelQRHardwareSignRequest()),
  };
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(QRHardwareSignRequest);
