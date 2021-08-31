import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

class AirGapedStateWather extends Component {
  componentDidUpdate(prevProps) {
    const { airgaped, showAirGapedWalletImporter } = this.props;
    const { sync, sign } = airgaped;
    if (!!sync.reading) {
      showAirGapedWalletImporter();
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AirGapedStateWather);
