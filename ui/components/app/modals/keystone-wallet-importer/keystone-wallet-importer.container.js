import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  cancelReadKeystoneCryptoHDKey,
  submitKeystoneCryptoHDKey,
  hideModal,
} from '../../../../store/actions';
import KeystoneWalletImporter from './keystone-wallet-importer.component';

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => {
      dispatch(hideModal());
    },
    submitKeystoneCryptoHDKey: (cbor) => submitKeystoneCryptoHDKey(cbor),
    cancelReadKeystoneCryptoHDKey: () => cancelReadKeystoneCryptoHDKey(),
  };
};

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(KeystoneWalletImporter);
