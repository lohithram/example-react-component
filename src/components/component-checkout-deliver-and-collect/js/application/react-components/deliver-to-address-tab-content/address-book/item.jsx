import React, { Component, PropTypes } from 'react';
import { ClassNameUtil, Text, Button, Anchor, DebugUtil } from '../../../class-library';

export default class AddressBookItem extends Component {
  /**
   * _onClickRemoveAddress
   * Click handler for the remove address button click
   */
  _onClickRemoveAddress(event) {
    DebugUtil.log("Remove address button click", event, this.props.address);
    event.preventDefault();
    this.props.removeAddressClickHandler(this.props.address);
  }

  /**
   * _onClickUseAddress
   * Click handler for the use address button click
   */
  _onClickUseAddress(event) {
    DebugUtil.log("Use address button click", event, this.props.address);
    event.preventDefault();
    this.props.useAddressClickHandler(this.props.address);
  }

  renderAddressAction() {
    if(this.props.isUnavailable) {
      return (
        <Text
          className={ClassNameUtil.getClassNames(['fbra_componentCheckoutAddressBook__addressNotAvailbleText', 'fbra_test_componentCheckoutAddressBook__addressNotAvailbleText'])}>
          {this.props.thisAddressCanNotBeUsedText}
        </Text>
      );
    }

    return (
      <Button
        className={ClassNameUtil.getClassNames(['fbra_componentCheckoutAddressBook__useAddressButton', 'fbra_test_componentCheckoutAddressBook__useAddressButton'])}
        title={this.props.useAddressText}
        onClick={this._onClickUseAddress.bind(this)}>
        {this.props.useAddressText}
      </Button>
    )
  }

  render() {
    const baseClass = AddressBookItem.defaultProps.className;
    const classNames = ClassNameUtil.getClassNames([ClassNameUtil.getComponentClassNames(this), {
      [`${baseClass}--isUnavailable`]: this.props.isUnavailable
    }]);

    return (
      <li className={classNames}>
        <Text className={ClassNameUtil.getClassNames(['fbra_componentCheckoutAddressBook__savedAddressText', 'fbra_test_componentCheckoutAddressBook__savedAddressText'])}>{this.props.address.customerAddress}</Text>
        {this.renderAddressAction()}
        <Anchor
          className={ClassNameUtil.getClassNames(['fbra_componentCheckoutAddressBook__removeAddressButton', 'fbra_test_componentCheckoutAddressBook__removeAddressButton'])}
          href="#"
          title={this.props.removeText}
          onClick={this._onClickRemoveAddress.bind(this)}
        >
          {this.props.removeText}
        </Anchor>
      </li>
    );
  }
}

AddressBookItem.PropTypes = {
  isUnavailable: PropTypes.bool,
  address: PropTypes.shape({ customerAddress: PropTypes.string }),
  useAddressText: PropTypes.string,
  useAddressClickHandler: PropTypes.func.isRequired,
  removeText: PropTypes.string,
  removeAddressClickHandler: PropTypes.func.isRequired
}

AddressBookItem.defaultProps = {
  isUnavailable: false,
  className: 'fbra_componentCheckoutAddressBook__savedAddress'
}
