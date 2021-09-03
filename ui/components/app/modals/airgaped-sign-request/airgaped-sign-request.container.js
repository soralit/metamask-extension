import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  submitAirGapedSignature,
  hideModal,
  cancelAirGapedSignRequest,
} from '../../../../store/actions';
import AirGapedSignRequest from './airgaped-sign-request.component';

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => {
      dispatch(hideModal());
    },
    submitAirGapedSignature: (requestId, cbor) =>
      submitAirGapedSignature(requestId, cbor),
    cancelAirGapedSignRequest: () => dispatch(cancelAirGapedSignRequest()),
  };
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(AirGapedSignRequest);
