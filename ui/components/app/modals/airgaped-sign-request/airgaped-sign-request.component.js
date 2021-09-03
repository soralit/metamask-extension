import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from './player';
import Reader from './reader';
import withModalProps from '../../../../helpers/higher-order-components/with-modal-props';

class AirGapedSignRequest extends Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    submitAirGapedSignature: PropTypes.func.isRequired,
    cancelAirGapedSignRequest: PropTypes.func.isRequired,
    history: PropTypes.object,

    request: PropTypes.object.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      status: 'play',
    };
  }

  toRead = () => {
    this.setState({
      status: 'read',
    });
  };

  renderPlayer = () => {
    console.log(this.props);
    const {
      payload: request,
      cancelAirGapedSignRequest,
      hideModal,
    } = this.props;
    const { payload, title, description } = request;
    return (
      <Player
        type={payload.type}
        cbor={payload.cbor}
        title={title}
        description={description}
        hideModal={hideModal}
        cancelAirGapedSignRequest={cancelAirGapedSignRequest}
        toRead={this.toRead}
      />
    );
  };

  renderReader = () => {
    const {
      cancelAirGapedSignRequest,
      hideModal,
      submitAirGapedSignature,
      payload: request,
    } = this.props;
    return (
      <Reader
        cancelAirGapedSignRequest={cancelAirGapedSignRequest}
        hideModal={hideModal}
        submitAirGapedSignature={submitAirGapedSignature}
        requestId={request.requestId}
      />
    );
  };

  render() {
    const { status } = this.state;
    if (status === 'play') {
      return this.renderPlayer();
    } else {
      return this.renderReader();
    }
  }
}

export default withModalProps(AirGapedSignRequest);
