import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  ContextualErrorMessages,
  ContextualLoadingWrapper,
  DeliverAndCollectFormIdentifier as FormIdentifier,
  Heading,
  InlineNotification
} from '../../class-library';
import AddressSummary from './address-summary';
import DeliverySummary from './delivery-summary';
import WhenToDeliver from './when-to-deliver';
import ReceiveDelivery from '../receive-delivery';
import DeliveryInstructions from '../delivery-instructions';
import HomeDeliveryActions from '../../actions/home-delivery-actions';
import AddressActions from '../../actions/address-actions';

export default class AddressSelectedScreen extends Component {

  /**
   * Section header
   */
  _renderSectionHeading(text='') {
    return <Heading level={3} className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen__heading', 'fbra_test_addressSelectedScreen__heading'])}>{ text }</Heading>;
  }

  /**
   * Handler to dispatch when the user wants to discard the current order
   * address and return to either their address book (if they have one) or the
   * address form.
   */
  _onEditAddress() {
    AddressActions.editAddress();
  }

  /**
   * Render Summary
   * Renders the delivery summary.
   * The summary content depends on whether this is a master or slave delivery.
   */
  _renderSummary(){
    const { orderAddress, whoWillCollect, deliveryInstructions, textDictionary, isMaster } = this.props;
    return(
      <DeliverySummary
        orderAddress={orderAddress}
        deliveryInstructions={deliveryInstructions}
        textDictionary={textDictionary}
        whoWillReceive={whoWillCollect}
        isMaster={isMaster}
        onEditAddress={this._onEditAddress.bind(this)}
      />
    );
  }

  /**
   * Handler to dispatch when a new shipping method is selected
   */
  _onSelectShippingMethod(type) {
    HomeDeliveryActions.selectShippingMethod(this.props.deliveryGroupId, type);
  }

  /**
   * Handler to dispatch when a new time slot is selected
   */
  _onSelectTimeSlot(shippingMethodType, pageIndex, timeSlotId) {
    HomeDeliveryActions.selectTimeSlot(this.props.deliveryGroupId, shippingMethodType, pageIndex, timeSlotId, this.props.endPoints);
  }

  /**
   * Handler to dispatch when missing delivery slots are requested
   */
  _onRequestDeliverySlots(shippingMethodType, pageIndex) {
    HomeDeliveryActions.requestDeliverySlots(this.props.deliveryGroupId, shippingMethodType, pageIndex, this.props.endPoints);
  }

  /**
   * When should we deliver your order?
   */
  _renderWhenToDeliver() {
    const { shippingMethodsAndDeliverySlotExtras, maximumNumberOfWeeks, textDictionary } = this.props;
    if (!shippingMethodsAndDeliverySlotExtras) return null;

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen__whenToDeliver', 'fbra_test_addressSelectedScreen__whenToDeliver'])}>
        { this._renderSectionHeading(textDictionary.whenShouldWeDeliverOrderText) }
        { this._getHowCostCalculatedLink() }

        <ContextualErrorMessages for={`fbra_getDeliverySlotsByWeek__${this.props.deliveryGroupId}`} />
        <ContextualErrorMessages for={`fbra_submitDeliveryTimeSelection__${this.props.deliveryGroupId}`} />

        <ContextualLoadingWrapper
          loadingContexts={[
            `fbra_submitDeliveryTimeSelection__${this.props.deliveryGroupId}`,
            `fbra_getDeliverySlotsByWeek__${this.props.deliveryGroupId}`
          ]}>
          <WhenToDeliver
            shippingMethodsAndDeliverySlotExtras={ shippingMethodsAndDeliverySlotExtras }
            maximumNumberOfWeeks={ maximumNumberOfWeeks }
            textDictionary={ textDictionary }
            onSelectShippingMethod={ this._onSelectShippingMethod.bind(this) }
            onSelectTimeSlot={ this._onSelectTimeSlot.bind(this) }
            onRequestDeliverySlots={ this._onRequestDeliverySlots.bind(this) }
          />
        </ContextualLoadingWrapper>
      </div>
    );
  }

  /**
   * _getHowCostCalculatedLink
   * Returns the uri string data
   */
  _getHowCostCalculatedLink() {
    return (
      <InlineNotification
        message={this.props.textDictionary.howDeliveryCostsAreCalculatedText}
        className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen__howCostCalculatedLink', 'fbra_test_addressSelectedScreen__howCostCalculatedLink'])}
      />
    );
  }

  /**
   * Handler to dispatch upon whoWillCollect form field change
   */
  _onChangeWhoWillReceiveDelivery({ name, value }) {
    HomeDeliveryActions.changeWhoWillReceiveDeliveryFormField(
      this.props.deliveryGroupId,
      name,
      value
    );
  }

  /**
   * Who will receive this delivery?
   */
  _renderWhoWillReceiveDelivery() {
    const { deliveryGroupId, whoWillCollect, textDictionary, isMaster } = this.props;
    if (!isMaster || !whoWillCollect) return null;

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen__whoWillReceiveDelivery', 'fbra_test_addressSelectedScreen__whoWillReceiveDelivery'])}>
        { this._renderSectionHeading(whoWillCollect.whoWillCollect.label) }

        <ReceiveDelivery
          whoWillCollect={ whoWillCollect.whoWillCollect }
          thirdPersonFirstName={ whoWillCollect.thirdPersonFirstName }
          thirdPersonLastName={ whoWillCollect.thirdPersonLastName }
          thirdPersonPhoneNumber={ whoWillCollect.thirdPersonPhoneNumber }
          initialThirdPersonId={ whoWillCollect.thirdPersonId }
          thirdPersonIdSelectorLink={ whoWillCollect.thirdPersonIdSelectorLink }
          initialThirdPersonIdType={ whoWillCollect.thirdPersonIdType }
          thirdPersonIdSelectorAction={ whoWillCollect.thirdPersonIdSelectorAction }
          formContext={FormIdentifier.whoWillCollect(deliveryGroupId)}
          onChange={ this._onChangeWhoWillReceiveDelivery.bind(this) }
        />
      </div>
    );

  }

  /**
   * Handler to dispatch delivery instructions changes
   */
  _onChangeDeliveryInstructions(value) {
    HomeDeliveryActions.changeDeliveryInstructions(this.props.deliveryGroupId, value);
  }

  /**
   * Delivery Instructions
   */
  _renderDeliveryInstructions(){
    const { deliveryGroupId, deliveryInstructions, textDictionary, isMaster } = this.props;
    if (!isMaster || !deliveryInstructions) return null;

    // @todo:TODO: there is confusion over the textDictionary text vs the field label
    // when compared with the wireframes - they seem to be switched.

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen__deliveryInstructions', 'fbra_test_addressSelectedScreen__deliveryInstructions'])}>
        { this._renderSectionHeading(textDictionary.deliveryInstructionsText) }

        <DeliveryInstructions
          deliveryGroupId={deliveryGroupId}
          deliveryInstructionsText={ deliveryInstructions.label }
          deliveryInstructions={ deliveryInstructions }
          onChange={ this._onChangeDeliveryInstructions.bind(this) }
        />
      </div>
    );
  }

  render() {
    return (
      <div className={ClassNameUtil.getClassNames(['fbra_addressSelectedScreen', 'fbra_test_addressSelectedScreen'])}>
        { this._renderSummary() }
        { this._renderWhenToDeliver() }
        { this._renderWhoWillReceiveDelivery() }
        { this._renderDeliveryInstructions() }
      </div>
    );
  }
}

/**
 * NB PropTypes not propTypes - useful for upstream validation
 */
AddressSelectedScreen.PropTypes = {
  textDictionary: {
    // AddressSummary
    addDifferentAddressText: PropTypes.string.isRequired,
    addAddressEditAreaText: PropTypes.string.isRequired,

    // WhenToDeliver
    whenShouldWeDeliverOrderText: PropTypes.string.isRequired,
    ...WhenToDeliver.PropTypes.textDictionary,

    // DeliveryInstructions header text
    deliveryInstructionsText: PropTypes.string.isRequired
  }
};

/**
 * NB propTypes not PropTypes - standard React propTypes
 */
AddressSelectedScreen.propTypes = {
  deliveryGroupId: PropTypes.string.isRequired,

  // orderAddress validation, taken directly from AddressSummary
  orderAddress: AddressSummary.propTypes.orderAddress,

  // shippingMethodsAndDeliverySlotExtras validation, taken directly from WhenToDeliver
  shippingMethodsAndDeliverySlotExtras: WhenToDeliver.propTypes.shippingMethodsAndDeliverySlotExtras,

  maximumNumberOfWeeks: PropTypes.number.isRequired,

  // deliveryInstructions validation, taken directly from DeliveryInstructions
  deliveryInstructions: DeliveryInstructions.propTypes.deliveryInstructions,

  // actually who will receive
  whoWillCollect: PropTypes.object,

  textDictionary: PropTypes.shape(AddressSelectedScreen.PropTypes.textDictionary).isRequired,

  isMaster: PropTypes.bool.isRequired,

  endPoints: PropTypes.object.isRequired
};

AddressSelectedScreen.defaultProps = {
  isMaster: true
};
