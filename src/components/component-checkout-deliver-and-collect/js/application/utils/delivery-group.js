import { DeliverToAddressStatusTypes } from '../class-library';
import DeliveryGroupScreenTypes from '../constants/delivery-group-screen-types';
import NotificationKeys from '../constants/notification-keys';

export default class DeliveryGroupUtil {
  /**
   * getActiveDeliverToAddressScreenForMasterDeliveryGroup
   * Returns the active deliver to address screen for the master delivery group, all slave screens are derived from this screen
   */
  static getActiveDeliverToAddressScreenForMasterDeliveryGroup(deliverAndCollectStatus) {
    switch (deliverAndCollectStatus) {
      case DeliverToAddressStatusTypes.GUEST_WITH_NO_LOCATION:
        return DeliveryGroupScreenTypes.NONE;
        break;
      case DeliverToAddressStatusTypes.GUEST_WITH_LOCATION_OR_AUTHORISED_WITH_LOCATION_NO_SAVED_ADDRESSES:
        return DeliveryGroupScreenTypes.ADD_ADDRESS;
        break;
      case DeliverToAddressStatusTypes.GUEST_WITH_ADDRESS_OR_AUTHORISED_WITH_ADDRESS_NO_SAVED_ADDRESSES:
        return DeliveryGroupScreenTypes.ADDRESS_SELECTED;
        break;
      case DeliverToAddressStatusTypes.AUTHORISED_WITH_ADDRESS_SAVED_ADDRESSES:
        return DeliveryGroupScreenTypes.ADDRESS_SELECTED;
        break;
      case DeliverToAddressStatusTypes.AUTHORISED_NO_ADDRESS_SAVED_ADDRESSES_DEFAULT_DELIVERY_ANY:
        return DeliveryGroupScreenTypes.SELECT_ADDRESS;
        break;
      case DeliverToAddressStatusTypes.AUTHORISED_NO_ADDRESS_NO_SAVED_ADDRESSES_PREFERRED_STORE_DEFAULT_DELIVERY_CLICK_AND_COLLECT:
        return DeliveryGroupScreenTypes.ADD_ADDRESS;
        break;
    }
    return DeliveryGroupScreenTypes.NONE;
  }

  /**
   * getActiveDeliverToAddressScreenForSlaveDeliveryGroup
   * Returns the active deliver to address screen for a slave delivery group
   */
  static getActiveDeliverToAddressScreenForSlaveDeliveryGroup(deliverAndCollectStatus) {
    const masterScreen = DeliveryGroupUtil.getActiveDeliverToAddressScreenForMasterDeliveryGroup(deliverAndCollectStatus);
    return (masterScreen === DeliveryGroupScreenTypes.ADDRESS_SELECTED) ? DeliveryGroupScreenTypes.ADDRESS_SELECTED : DeliveryGroupScreenTypes.NONE;
  }

  /**
   * getActiveClickAndCollectScreenForDeliveryGroup
   * Returns the active click and collect screen
   */
  static getActiveClickAndCollectScreenForDeliveryGroup(selectedStore, searchedStores) {
    // 1. if a store has been selected, return selected store
    if (selectedStore) {
      return DeliveryGroupScreenTypes.STORE_SELECTED;
    }

    // 2. if no selected store and there are searchedStores results, return select a store
    if (searchedStores && searchedStores.length > 0) {
      return DeliveryGroupScreenTypes.SELECT_STORE;
    }

    // 3. return empty select store screen with search box
    return DeliveryGroupScreenTypes.SELECT_STORE;
  }

  /**
   * getDeliveryGroupTabAvailability
   * @param {object} deliveryGroup
   * @returns {object} deliveryGroup tab availability
   */
  static getDeliveryGroupTabAvailability(deliveryGroup) {
    return {
      deliveryAvailable: deliveryGroup && (typeof deliveryGroup.homeDelivery !== 'undefined'),
      collectAvailable: deliveryGroup && (typeof deliveryGroup.clickAndCollect !== 'undefined')
    }
  }

  /**
   * getShouldOverrideActiveScreenForNotification
   * overrides active screen if a notification rule requires
   * @param {array} notifications
   * @returns {bool} true if notification rule should override active screen
   */
  static getShouldOverrideActiveScreenForNotification(notifications) {
    return (notifications && notifications.findIndex(x => x.messageKey === NotificationKeys.SELECT_DELIVERY) !== -1) || false;
  }
}
