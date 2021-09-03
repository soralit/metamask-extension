import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

class AirGapedStateWather extends Component {
  static propTypes = {
    airgaped: PropTypes.object.isRequired,
    showAirGapedWalletImporter: PropTypes.func.isRequired,
    showAirGapedSignRequest: PropTypes.func.isRequired,
  };
  componentDidUpdate(prevProps) {
    const {
      airgaped,
      showAirGapedWalletImporter,
      showAirGapedSignRequest,
    } = this.props;
    const { sync, sign } = airgaped;
    if (!!sync.reading) {
      showAirGapedWalletImporter();
    }
    if (!!sign.request) {
      showAirGapedSignRequest(sign.request);
    }
  }
  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    airgaped: state.metamask.airgaped,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showAirGapedWalletImporter: () => {
      dispatch(actions.showAirGapedWalletImporter());
    },
    showAirGapedSignRequest: (request) => {
      dispatch(actions.showAirGapedSignRequest(request));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AirGapedStateWather);
