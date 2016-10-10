
/************************************************************************
 * DeliverToAddressTabContentContainer
 * The main controller view for the content within the deliver to address tab
 * of the deliver or collect item
 ************************************/

// React
import React, { Component, PropTypes } from 'react';
import {
  SavedAddressStore,
  RequiresLoginStore
} from '../../stores/stores';
import DeliveryGroupScreenTypes from '../../constants/delivery-group-screen-types';
import AddAddressScreen from './add-address-screen';
import AddressSelectedScreen from './address-selected-screen';
import SelectAddressScreen from './select-address-screen';
import DeliveryGroupUtil from '../../utils/delivery-group'
import {
  DebugUtil,
  ClassNameUtil,
  InlineNotification,
  WhoWillCollectStore,
  OrderAddressStore,
  DeliveryInstructionsStore,
  DeliveryGroupStore,
  DeliveryGroupTabTypes,
  ShippingMethodsStore,
  DeliverToAddressStatusStore
} from '../../class-library';

export default class DeliverToAddressTabContentContainer extends Component {
  constructor(options) {
    super(options);
    this._bindHandlers();
    this.state = this._buildStateFromStores();
  }

  /**
   * bindHandlers
   * Bind all handlers
   */
  _bindHandlers(){
    this._handleStoreChange = this._handleStoreChange.bind(this);
  }

  /**
   * componentDidMount
   * Called upon component mount
   */
  componentDidMount() {
    this.mounted = true;
    this._addStoreListeners();
  }

  /**
   * componentWillUnmount
   * Called just before component unmounts
   */
  componentWillUnmount() {
    this.mounted = false;
    this._removeStoreListeners();
  }

  /************************************
   * Stores
   ************************************/

  /**
   * buildStateFromStores
   * Builds the component container state from all the stores
   */
  _buildStateFromStores() {
    const { deliveryGroupId, isMaster, masterDeliveryGroupId } = this.props;

    const deliverToAddressStatus = DeliverToAddressStatusStore.getStatus();
    const activeScreen = isMaster
      ? DeliveryGroupUtil.getActiveDeliverToAddressScreenForMasterDeliveryGroup(deliverToAddressStatus)
      : DeliveryGroupUtil.getActiveDeliverToAddressScreenForSlaveDeliveryGroup(deliverToAddressStatus);

    const notifications = DeliveryGroupStore.getDeliveryGroupDeliverToAddressNotifications(deliveryGroupId);
    const orderAddress = OrderAddressStore.getAddress();
    const savedAddresses = SavedAddressStore.getSavedAddresses();
    const shippingMethodsAndDeliverySlotExtras = ShippingMethodsStore.getShippingMethodsAndDeliverySlotExtras(deliveryGroupId);
    const whoWillCollect = WhoWillCollectStore.getWhoWillReceiveDelivery(masterDeliveryGroupId);
    const deliveryInstructions = DeliveryInstructionsStore.getDeliveryInstructions(masterDeliveryGroupId);
    const requiresLogin = RequiresLoginStore.getRequiresLogin();

    return {
      activeScreen,
      orderAddress,
      savedAddresses,
      shippingMethodsAndDeliverySlotExtras,
      whoWillCollect,
      deliveryInstructions,
      notifications,
      requiresLogin
    };
  }

  /**
   * addStoreListeners
   * Add all store listeners
   */
  _addStoreListeners() {
    DebugUtil.log("Adding store listeners");
    this.deliverToAddressStatusStoreListener = DeliverToAddressStatusStore.addChangeListener(this._handleStoreChange);
    this.orderAddressStoreListener = OrderAddressStore.addChangeListener(this._handleStoreChange);
    this.savedAddressStoreListener = SavedAddressStore.addChangeListener(this._handleStoreChange);
    this.shippingMethodsStoreListener = ShippingMethodsStore.addChangeListener(this._handleStoreChange);
    this.whoWillCollectStoreListener = WhoWillCollectStore.addChangeListener(this._handleStoreChange);
    this.deliveryInstructionsStoreListener = DeliveryInstructionsStore.addChangeListener(this._handleStoreChange);
    this.deliveryGroupStoreListener = DeliveryGroupStore.addChangeListener(this._handleStoreChange);
    this.requiresLoginStoreListener = RequiresLoginStore.addChangeListener(this._handleStoreChange);
  }

  /**
   * removeStoreListeners
   * Remove all store listeners
   */
  _removeStoreListeners() {
    DebugUtil.log("Removing store listeners");
    if (this.deliverToAddressStatusStoreListener) this.deliverToAddressStatusStoreListener.dispose();
    if (this.orderAddressStoreListener) this.orderAddressStoreListener.dispose();
    if (this.savedAddressStoreListener) this.savedAddressStoreListener.dispose();
    if (this.shippingMethodsStoreListener) this.shippingMethodsStoreListener.dispose();
    if (this.whoWillCollectStoreListener) this.whoWillCollectStoreListener.dispose();
    if (this.deliveryInstructionsStoreListener) this.deliveryInstructionsStoreListener.dispose();
    if (this.deliveryGroupStoreListener) this.deliveryGroupStoreListener.dispose();
  }

  /**
   * handleStoreChange
   * Called upon event of change in all stores
   */
  _handleStoreChange() {
    if(this.mounted)
      this.setState(this._buildStateFromStores());
  }

  /************************************
   * Render
   ************************************/

  /**
   * getSelectAddressScreenContent
   * Return the select address screen content
   */
  _getSelectAddressScreenContent() {
    const containerClassNames = ClassNameUtil.getClassNames([
      'fbra_deliverToAddressTabContentContainer__selectAddressScreen',
      'fbra_test_deliverToAddressTabContentContainer__selectAddressScreen',
      'fbra_test_deliverToAddressTabContentContainer_selectAddressScreen'
    ]);

    return (
      <div className={containerClassNames}>
        <SelectAddressScreen
          savedAddresses={ this.state.savedAddresses }
          textDictionary={ this.props.textDictionary }
          requiresLogin={this.state.requiresLogin}
          endPoints={ this.props.endPoints } />
      </div>
    );
  }

  /**
   * getAddressSelectedScreenContent
   * Return the address selected screen content
   */
  _getAddressSelectedScreenContent() {
    const containerClassNames = ClassNameUtil.getClassNames([
      'fbra_deliverToAddressTabContentContainer__addressSelectedScreen',
      'fbra_test_deliverToAddressTabContentContainer__addressSelectedScreen',
      'fbra_test_deliverToAddressTabContentContainer_addressSelectedScreen'
    ]);

    return (
      <div className={containerClassNames}>
        <AddressSelectedScreen
          deliveryGroupId={ this.props.deliveryGroupId }
          orderAddress={ this.state.orderAddress }
          shippingMethodsAndDeliverySlotExtras={ this.state.shippingMethodsAndDeliverySlotExtras }
          maximumNumberOfWeeks={ this.props.maximumNumberOfWeeks }
          whoWillCollect={ this.state.whoWillCollect }
          deliveryInstructions={ this.state.deliveryInstructions }
          textDictionary={ this.props.textDictionary }
          isMaster={ this.props.isMaster }
          endPoints={ this.props.endPoints }
        />
      </div>
    );
  }

  /**
   * _getAddAddressScreenContent
   * Return the add address screen content
   */
  _getAddAddressScreenContent() {
    const containerClassNames = ClassNameUtil.getClassNames([
      'fbra_deliverToAddressTabContentContainer__addAddressScreen',
      'fbra_test_deliverToAddressTabContentContainer__addAddressScreen',
      'fbra_test_deliverToAddressTabContentContainer_addAddressScreen'
    ]);

    return (
      <div className={containerClassNames}>
        <AddAddressScreen
          textDictionary={this.props.textDictionary}
          endPoints={this.props.endPoints}
          isMaster={this.props.isMaster} />
      </div>
    );
  }

  /**
   * getContent
   * Return the component
   */
  _getActiveScreenContent() {
    if (DeliveryGroupUtil.getShouldOverrideActiveScreenForNotification(this.state.notifications)) {
      return null;
    }

    switch (this.state.activeScreen) {
      case DeliveryGroupScreenTypes.SELECT_ADDRESS:
        return this._getSelectAddressScreenContent();
        break;
      case DeliveryGroupScreenTypes.ADDRESS_SELECTED:
        return this._getAddressSelectedScreenContent();
        break;
      case DeliveryGroupScreenTypes.ADD_ADDRESS:
        return this._getAddAddressScreenContent();
        break;
    }
    return null;
  }

  /**
   * _getNotificationsContent
   * Return the delivery group deliver to address notifications content
   */
  _getNotificationsContent() {
    const { deliveryGroupId } = this.props;
    if (this.state.notifications) {
      return this.state.notifications.map((notification) => {
        const { message } = notification;
        return (
          <InlineNotification key={`deliver-to-address-notification-${deliveryGroupId}`} message={message} className={ClassNameUtil.getClassNames(['fbra_deliverToAddressTabContentContainer__notification', 'fbra_test_deliverToAddressTabContentContainer__notification'])}/>
        );
      })
    }
    return null;
  }

  /**
   * render
   * Render component
   */
  render() {
    const activeScreenContent = this._getActiveScreenContent();
    const notificationsContent = this._getNotificationsContent();

    if (notificationsContent !== null || activeScreenContent !== null) {
      const containerClassNames = ClassNameUtil.getClassNames([
        'fbra_deliverToAddressTabContentContainer',
        'fbra_test_deliverToAddressTabContentContainer'
      ]);

      return (
        <div className={containerClassNames}>
          {notificationsContent}
          {activeScreenContent}
        </div>
      );
    }

    return null;
  }
}

DeliverToAddressTabContentContainer.propTypes = {
  textDictionary: PropTypes.shape({
    // All textDictionary keys SelectAddressScreen needs
    ...SelectAddressScreen.PropTypes.textDictionary,

    // All textDictionary keys AddressSelectedScreen needs
    ...AddressSelectedScreen.PropTypes.textDictionary
  }).isRequired,

  deliveryGroupId: PropTypes.string.isRequired,
  isMaster: PropTypes.bool.isRequired,
  maximumNumberOfWeeks: PropTypes.number.isRequired,
  endPoints: PropTypes.object.isRequired
}

DeliverToAddressTabContentContainer.defaultProps = {
  isMaster: false
}
