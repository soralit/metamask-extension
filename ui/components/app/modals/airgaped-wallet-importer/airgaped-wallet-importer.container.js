import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  cancelReadAirGapedCryptoHDKey,
  submitAirGapedCryptoHDKey,
  hideModal,
} from '../../../../store/actions';
import AirGapedWalletImporter from './airgaped-wallet-importer.component';

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => {
      dispatch(hideModal());
    },
    submitAirGapedCryptoHDKey: (cbor) => submitAirGapedCryptoHDKey(cbor),
    cancelReadAirGapedCryptoHDKey: () => dispatch(cancelReadAirGapedCryptoHDKey()),
  };
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(AirGapedWalletImporter);
