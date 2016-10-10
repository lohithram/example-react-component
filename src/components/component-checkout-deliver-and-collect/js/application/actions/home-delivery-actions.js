import { ApplicationDispatcher, ContextUtil, LoadingActions, WebServiceUtil, DeliverAndCollectActionTypes as ActionTypes } from '../class-library';
import HomeDeliveryServerActions from './home-delivery-server-actions';

export default class HomeDeliveryActions {

  /**
   * Shipping methods and delivery slots
   */
  static selectShippingMethod(deliveryGroupId, shippingMethodType) {
    ApplicationDispatcher.dispatch({
      actionType: ActionTypes.SELECT_SHIPPING_METHOD,
      action: { deliveryGroupId, shippingMethodType }
    });
  }

  static selectTimeSlot(deliveryGroupId, shippingMethodType, pageIndex, timeSlotId, endPoints) {
    const data = {
      deliveryGroupId,
      timeSlotId,
      type: shippingMethodType
    };

    const context = `fbra_submitDeliveryTimeSelection__${deliveryGroupId}`;

    LoadingActions.start(context);

    WebServiceUtil.makeWebServiceRequest(
      endPoints.submitDeliveryTimeSelection.path,
      endPoints.submitDeliveryTimeSelection.type,
      data,
      ContextUtil.getUniqueContext(context)
    )
      .then(
        resolution => {
          if (resolution.response.success === true) {
            HomeDeliveryServerActions.handleSubmitDeliveryTimeSelectionSuccess(
              deliveryGroupId,
              shippingMethodType,
              pageIndex,
              timeSlotId,
              resolution,
              context
            );
          } else {
            HomeDeliveryServerActions.handleSubmitDeliveryTimeSelectionFailure(resolution, context);
          }
        },
        rejection => HomeDeliveryServerActions.handleSubmitDeliveryTimeSelectionFailure(rejection, context)
      )
      .then(() => LoadingActions.stop(context));
  }

  static requestDeliverySlots(deliveryGroupId, shippingMethodType, pageIndex, endPoints) {
    const data = {
      deliveryGroupId,
      homeDeliveryType: shippingMethodType,
      pageIndex
    };

    const context = `fbra_getDeliverySlotsByWeek__${deliveryGroupId}`;

    LoadingActions.start(context);

    WebServiceUtil.makeWebServiceRequest(
      endPoints.getDeliverySlotsByWeek.path,
      endPoints.getDeliverySlotsByWeek.type,
      data,
      ContextUtil.getUniqueContext(context)
    )
      .then(
        resolution => {
          if (resolution.response.success === true) {
            HomeDeliveryServerActions.handleGetDeliverySlotsByWeekSuccess(
              deliveryGroupId,
              shippingMethodType,
              resolution,
              context
            );
          } else {
            HomeDeliveryServerActions.handleGetDeliverySlotsByWeekFailure(resolution, context)
          }
        },
        rejection => HomeDeliveryServerActions.handleGetDeliverySlotsByWeekFailure(rejection, context)
      )
      .then(() => LoadingActions.stop(context));
  }

  /**
   * Who will collect / Who will receive delivery
   */
  static changeWhoWillReceiveDeliveryFormField(deliveryGroupId, name, value) {
    ApplicationDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_WHO_WILL_RECEIVE_DELIVERY_FORM_FIELD,
      action: { deliveryGroupId, name, value }
    });
  }

  /**
   * Delivery instructions
   */
  static changeDeliveryInstructions(deliveryGroupId, value) {
    ApplicationDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_DELIVERY_INSTRUCTIONS,
      action: { deliveryGroupId, value }
    });
  }
}
