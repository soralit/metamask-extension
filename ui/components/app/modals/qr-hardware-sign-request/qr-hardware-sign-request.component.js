import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from './player';
import Reader from './reader';
import withModalProps from '../../../../helpers/higher-order-components/with-modal-props';

class QRHardwareSignRequest extends Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    submitQRHardwareSignature: PropTypes.func.isRequired,
    cancelQRHardwareSignRequest: PropTypes.func.isRequired,
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
    const {
      payload: request,
      cancelQRHardwareSignRequest,
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
        cancelQRHardwareSignRequest={cancelQRHardwareSignRequest}
        toRead={this.toRead}
      />
    );
  };

  renderReader = () => {
    const {
      cancelQRHardwareSignRequest,
      hideModal,
      submitQRHardwareSignature,
      payload: request,
    } = this.props;
    return (
      <Reader
        cancelQRHardwareSignRequest={cancelQRHardwareSignRequest}
        hideModal={hideModal}
        submitQRHardwareSignature={submitQRHardwareSignature}
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

export default withModalProps(QRHardwareSignRequest);
