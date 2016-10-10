import {ApplicationDispatcher, DebugUtil, ServerStateActionTypes, WebServiceUtil} from '../class-library';;
import DeliveryGroupHeaderActionsTypes from '../constants/delivery-group-header-types';

let _removeDeliveryGroup = (endPoint, deliveryGroupId, context) => {

  return WebServiceUtil.makeWebServiceRequest(
    endPoint.path,
    endPoint.type,
    {
      formSubmissionData: { deliveryGroupId: deliveryGroupId }
    },
    'fbra_deliveryGroupResponse'
  );
}

let _dispatchAction = (actionType, context, data ) => {
  ApplicationDispatcher.dispatch({
    actionType: actionType,
    action: {
      context: context,
      serverState: data
    }
  });
}

export default class DeliveryGroupHeaderActions {
  constructor() {}

  static removeDeliveryGroup(endPoint, deliveryGroupId, context){
    _removeDeliveryGroup(endPoint, deliveryGroupId, context)
    .then((resolution)=>{
      resolution.response.success === true
      ? _dispatchAction(ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE, context, resolution.response.state)
      : _dispatchAction(DeliveryGroupHeaderActionsTypes.REMOVE_DELIVERY_GROUP_HEADER_ERROR, context, resolution)

      return resolution;
    })
    .catch((rejection) => {
      DebugUtil.log("rejected:", rejection);
      _dispatchAction(DeliveryGroupHeaderActionsTypes.REMOVE_DELIVERY_GROUP_HEADER_ERROR, context, rejection.response)
    });
  }
}
