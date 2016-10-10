import React, { Component, PropTypes } from 'react';
import { ClassNameUtil } from '../../class-library';
import AddressSummary from './address-summary';
import ReceiveDeliveryOptions from '../../constants/receive-delivery-options';

export default class DeliverySummary extends Component {

  _onEditAddress() {
    this.props.onEditAddress();
  }

  _getAddressContent(){
    const { orderAddress, textDictionary, isMaster } = this.props;
    if (!orderAddress) return null;

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__address', 'fbra_test_deliverySummary__address'])}>
        <AddressSummary
          orderAddress={ orderAddress }
          onEditAddressLinkClick={ this._onEditAddress.bind(this) }
          onAddDifferentAddressLinkClick={ this._onEditAddress.bind(this) }
          addDifferentAddressText={ textDictionary.addDifferentAddressText }
          editText={ textDictionary.editText }
          isMaster={isMaster}
        />
      </div>
    );
  }

  _getWhoWillReceiveDeliveryContent(){
    const { whoWillReceive, textDictionary, isMaster } = this.props;
    if(isMaster || !whoWillReceive) return null;

    if(~whoWillReceive.whoWillCollect.fieldOptions.findIndex(x => x.selected && x.value === ReceiveDeliveryOptions.USER_RECEIVE_DELIVERY)){
      return (<div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__youAreReceivingThisPackage', 'fbra_test_deliverySummary__youAreReceivingThisPackage'])}>{textDictionary.youAreReceivingThisPackageText}</div>);
    }else{
      const recipientName = [whoWillReceive.thirdPersonFirstName.savedValue, whoWillReceive.thirdPersonLastName.savedValue].join(' ');
      const contactNumber = whoWillReceive.thirdPersonPhoneNumber.savedValue;
      return(
        <div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__whoWillReceiveDelivery', 'fbra_test_deliverySummary__whoWillReceiveDelivery'])}>
          <div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__whoWillReceiveDeliveryName', 'fbra_test_deliverySummary__whoWillReceiveDeliveryName'])}>{textDictionary.recipientText} {recipientName}</div>
          <div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__whoWillReceiveDeliveryNumber', 'fbra_test_deliverySummary__whoWillReceiveDeliveryNumber'])}>{textDictionary.contactNumberText} {contactNumber}</div>
        </div>
      );
    }

  }

  _getDeliveryInstructionsContent(){
    const { deliveryInstructions, textDictionary, isMaster } = this.props;
    if(isMaster) return null;
    if(!deliveryInstructions || !deliveryInstructions.savedValue) return null;

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_deliverySummary__deliveryInstructions', 'fbra_test_deliverySummary__deliveryInstructions'])}>{this.props.textDictionary.selectedDeliveryInstructionsText}: {deliveryInstructions.savedValue}</div>
    );
  }

  render(){
    const addressSummary = this._getAddressContent();
    const whoWillReceiveDeliverySummary = this._getWhoWillReceiveDeliveryContent();
    const deliveryInstructionsSummary = this._getDeliveryInstructionsContent();
    return(
      <div classNames={ClassNameUtil.getComponentClassNames(this)}>
        {addressSummary}
        {whoWillReceiveDeliverySummary}
        {deliveryInstructionsSummary}
      </div>
    )
  }

}
DeliverySummary.defaultProps = {
  isMaster: true,
  onEditAddress: () => {},
  defaultClassName: 'fbra_deliverySummary fbra_test_deliverySummary',
  classNames: ['fbra_test_summary'],
  className: ''
}
DeliverySummary.propTypes = {
  isMaster: PropTypes.bool.isRequired,
  textDictionary: PropTypes.object.isRequired,
  onEditAddress: PropTypes.func,

  orderAddress: PropTypes.object,
  whoWillReceive: PropTypes.object,
  deliveryInstructions: PropTypes.object
}
