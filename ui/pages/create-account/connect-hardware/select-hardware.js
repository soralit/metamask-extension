import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../../../components/ui/button';

export default class SelectHardware extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    connectToHardwareWallet: PropTypes.func.isRequired,
    browserSupported: PropTypes.bool.isRequired,
    useLedgerLive: PropTypes.bool.isRequired,
    isQRCodeOpen: PropTypes.bool.isRequired,
  };

  state = {
    selectedDevice: null,
  };

  connect = () => {
    if (this.state.selectedDevice) {
      this.props.connectToHardwareWallet(this.state.selectedDevice);
    }
    return null;
  };

  renderConnectToTrezorButton() {
    return (
      <button
        className={classnames('hw-connect__btn', {
          selected: this.state.selectedDevice === 'trezor',
        })}
        onClick={(_) => this.setState({ selectedDevice: 'trezor' })}
      >
        <img
          className='hw-connect__btn__img'
          src='images/trezor-logo.svg'
          alt='Trezor'
        />
      </button>
    );
  }

  renderConnectToLedgerButton() {
    return (
      <button
        className={classnames('hw-connect__btn', {
          selected: this.state.selectedDevice === 'ledger',
        })}
        onClick={(_) => this.setState({ selectedDevice: 'ledger' })}
      >
        <img
          className='hw-connect__btn__img'
          src='images/ledger-logo.svg'
          alt='Ledger'
        />
      </button>
    );
  }

  renderConnectToQRButton() {
    return (
      <button
        className={classnames('hw-connect__btn-large', {
          selected: this.state.selectedDevice === 'qr-hardware',
        })}
        onClick={(_) => this.setState({ selectedDevice: 'qr-hardware' })}
      >
        <img
          className='hw-connect__btn-large__img'
          src='images/qrcode-wallet-logo.svg'
          alt='QRCode'
        />
      </button>
    );
  }

  renderButtons() {
    return (
      <>
        <div className='hw-connect__btn-wrapper'>
          {this.renderConnectToLedgerButton()}
          {this.renderConnectToTrezorButton()}
        </div>
        {this.props.isQRCodeOpen && (
          <div className='hw-connect__btn-wrapper--qr'>{this.renderConnectToQRButton()}</div>)}
      </>
    );
  }

  renderContinueButton() {
    return (
      <Button
        type='primary'
        large
        className='hw-connect__connect-btn'
        onClick={this.connect}
        disabled={!this.state.selectedDevice}
      >
        {this.context.t('continue')}
      </Button>
    );
  }

  renderUnsupportedBrowser() {
    return (
      <div className='new-external-account-form unsupported-browser'>
        <div className='hw-connect'>
          <h3 className='hw-connect__title'>
            {this.context.t('browserNotSupported')}
          </h3>
          <p className='hw-connect__msg'>
            {this.context.t('chromeRequiredForHardwareWallets')}
          </p>
        </div>
        <Button
          type='primary'
          large
          onClick={() =>
            global.platform.openTab({
              url: 'https://google.com/chrome',
            })
          }
        >
          {this.context.t('downloadGoogleChrome')}
        </Button>
      </div>
    );
  }

  renderHeader() {
    return (
      <div className='hw-connect__header'>
        <h3 className='hw-connect__header__title'>
          {this.context.t('hardwareWallets')}
        </h3>
        <p className='hw-connect__header__msg'>
          {this.context.t('hardwareWalletsMsg')}
        </p>
      </div>
    );
  }

  renderTutorialsteps() {
    switch (this.state.selectedDevice) {
      case 'ledger':
        return this.renderLedgerTutorialSteps();
      case 'trezor':
        return this.renderTrezorTutorialSteps();
      case 'qr-hardware':
        return this.renderQRHardwareWalletSteps();
      default:
        return '';
    }
  }

  renderLedgerTutorialSteps() {
    const steps = [];
    if (this.props.useLedgerLive) {
      steps.push({
        title: this.context.t('step1LedgerWallet'),
        message: this.context.t('step1LedgerWalletMsg', [
          <a
            className='hw-connect__msg-link'
            href='https://www.ledger.com/ledger-live'
            rel='noopener noreferrer'
            target='_blank'
            key='ledger-live-app-link'
          >
            {this.context.t('ledgerLiveApp')}
          </a>,
        ]),
      });
    }

    steps.push({
      asset: 'plug-in-wallet',
      dimensions: { width: '225px', height: '75px' },
      title: this.context.t('step2LedgerWallet'),
      message: this.context.t('step2LedgerWalletMsg', [
        <a
          className='hw-connect__msg-link'
          href='https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet'
          rel='noopener noreferrer'
          target='_blank'
          key='ledger-support-link'
        >
          {this.context.t('hardwareWalletSupportLinkConversion')}
        </a>,
      ]),
    });

    return (
      <div className='hw-tutorial'>
        {steps.map((step, index) => (
          <div className='hw-connect' key={index}>
            <h3 className='hw-connect__title'>{step.title}</h3>
            <p className='hw-connect__msg'>{step.message}</p>
            {step.asset && (
              <img
                className='hw-connect__step-asset'
                src={`images/${step.asset}.svg`}
                {...step.dimensions}
                alt=''
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  renderTrezorTutorialSteps() {
    const steps = [
      {
        asset: 'plug-in-wallet',
        dimensions: { width: '225px', height: '75px' },
        title: this.context.t('step1TrezorWallet'),
        message: this.context.t('step1TrezorWalletMsg', [
          <a
            className='hw-connect__msg-link'
            href='https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet'
            rel='noopener noreferrer'
            target='_blank'
            key='trezor-support-link'
          >
            {this.context.t('hardwareWalletSupportLinkConversion')}
          </a>,
        ]),
      },
    ];

    return (
      <div className='hw-tutorial'>
        {steps.map((step, index) => (
          <div className='hw-connect' key={index}>
            <h3 className='hw-connect__title'>{step.title}</h3>
            <p className='hw-connect__msg'>{step.message}</p>
            {step.asset && (
              <img
                className='hw-connect__step-asset'
                src={`images/${step.asset}.svg`}
                {...step.dimensions}
                alt=''
              />
            )}
          </div>
        ))}
      </div>
    );
  }


  renderQRHardwareWalletSteps() {
    const steps = [];
    steps.push({
      title: 'QR-based HW Wallet',
      message: 'Connect an  airgapped hardware wallet that communicates through QR-codes.',
    });

    steps.push({
      message: 'Officially supported airgapped hardware wallets include:',
    });

    steps.push({
      message: <a
        className='hw-connect__msg-link'
        href='https://www.keyst.one/'
        rel='noopener noreferrer'
        target='_blank'
        key='keystone-support-link'
      >
        Keystone
      </a>,
    });

    steps.push({
      message: <a
        className='hw-connect__msg-link'
        href='https://www.ngrave.io/'
        rel='noopener noreferrer'
        target='_blank'
        key='keystone-support-link'
      >
        Ngrave
      </a>,
    });

    steps.push({
      message: <a
        className='hw-connect__msg-link'
        href='https://airgap.it/'
        rel='noopener noreferrer'
        target='_blank'
        key='keystone-support-link'
      >
        AirGap Vault
      </a>,
    });

    steps.push({
      asset: 'qrcode-wallet-demo',
      dimensions: { width: '225px', height: '75px' },
      message: 'More wallet integrations are currently underway.',
    });

    return (
      <div className='hw-tutorial'>
        {steps.map((step, index) => (
          <div className='hw-connect' key={index}>
            {step.title && (<h3 className='hw-connect__title'>{step.title}</h3>)}
            <p className='hw-connect__msg'>{step.message}</p>
            {step.asset && (
              <img
                className='hw-connect__step-asset'
                src={`images/${step.asset}.svg`}
                {...step.dimensions}
                alt=''
              />
            )}
          </div>
        ))}
      </div>
    );

  }

  renderConnectScreen() {
    return (
      <div className='new-external-account-form'>
        {this.renderHeader()}
        {this.renderButtons()}
        {this.state.selectedDevice && this.renderTutorialsteps()}
        {this.renderContinueButton()}
      </div>
    );
  }

  render() {
    if (this.props.browserSupported) {
      return this.renderConnectScreen();
    }
    return this.renderUnsupportedBrowser();
  }
}
