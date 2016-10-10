import { ApplicationDispatcher, ContextualErrorActions, DeliverAndCollectActionTypes as ComponentActionTypes } from '../class-library';

export default class HomeDeliveryServerActions {

  /**
   * getDeliverySlotsByWeek
   */

  static handleGetDeliverySlotsByWeekSuccess(
    deliveryGroupId,
    shippingMethodType,
    { response },
    contextIdentifier
  ) {
    ContextualErrorActions.clearErrors(contextIdentifier);
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.RECEIVE_SERVER_DELIVERY_SLOTS,
      action: {
        deliveryGroupId,
        shippingMethodType,
        pageIndex: response.deliverySlotPageIndex,
        deliverySlots: response.deliverySlots
      }
    });
  }

  static handleGetDeliverySlotsByWeekFailure({ response }, contextIdentifier) {
    ContextualErrorActions.receiveErrors(contextIdentifier, response.errors);
  }

  /**
   * submitDeliveryTimeSelection
   */

  static handleSubmitDeliveryTimeSelectionSuccess(deliveryGroupId, shippingMethodType, pageIndex, timeSlotId, { response }, contextIdentifier) {
    ContextualErrorActions.clearErrors(contextIdentifier);
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SELECT_TIME_SLOT,
      action: { deliveryGroupId, shippingMethodType, pageIndex, timeSlotId }
    });
  }

  static handleSubmitDeliveryTimeSelectionFailure({ response }, contextIdentifier) {
    ContextualErrorActions.receiveErrors(contextIdentifier, response.errors);
  }
}
