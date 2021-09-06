import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import Button from '../../../ui/button';
import { UR, UREncoder } from '@ngraveio/bc-ur';

export default class SignRequestPlayer extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    cbor: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,

    hideModal: PropTypes.func.isRequired,
    cancelQRHardwareSignRequest: PropTypes.func.isRequired,
    toRead: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { cbor, type } = props;
    const ur = new UR(Buffer.from(cbor, 'hex'), type);
    const urEncoder = new UREncoder(ur, 400);
    this.state = {
      currentQRCode: urEncoder.nextPart(),
      urEncoder,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState((state) => {
        const { urEncoder } = state;
        return {
          currentQRCode: urEncoder.nextPart(),
        };
      });
    }, 100);
  }

  handleCancel() {
    const { cancelQRHardwareSignRequest, hideModal } = this.props;
    hideModal();
    cancelQRHardwareSignRequest();
  }

  render() {
    const { currentQRCode } = this.state;
    const { toRead } = this.props;

    return (
      <div className="qr-scanner">
        <div className="qr-scanner__title">
          <p>{this.context.t('scanWithQRHardwareWallet')}</p>
        </div>
        <div
          className="qr-scanner__content"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: 20,
          }}
        >
          <QRCode value={currentQRCode.toUpperCase()} size={250} />
        </div>
        <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
          {this.context.t('scanQRHardwareDescription')}
        </div>
        <div className="qr-hardware-transaction-display__button-group">
          <Button
            className="qr-hardware-transaction-display__button"
            type="default"
            onClick={() => {
              this.handleCancel();
            }}
          >
            {this.context.t('cancelTransaction')}
          </Button>
          <Button
            className="qr-hardware-transaction-display__button"
            type="primary"
            onClick={toRead}
          >
            {this.context.t('getQRHardwareSignature')}
          </Button>
        </div>
      </div>
    );
  }
}
