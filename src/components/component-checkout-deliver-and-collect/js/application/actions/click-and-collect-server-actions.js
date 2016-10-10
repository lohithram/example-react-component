import {
  ApplicationDispatcher,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

export default class ClickAndCollectServerActions {

  static handleSearchStoresSuccess(deliveryGroupId, serviceResponse) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SEARCH_STORES_REQUEST_SUCCESS,
      action: {
        deliveryGroupId: deliveryGroupId,
        stores: serviceResponse.response.listOfStores
      }
    });
  }

  static handleSearchStoresFailure(deliveryGroupId, serviceResponse) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SEARCH_STORES_REQUEST_FAILURE,
      action: {
        deliveryGroupId: deliveryGroupId,
        errors: serviceResponse.response.errors
      }
    });
  }

  static handleSetStoreSuccess(deliveryGroupId, serviceResponse) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_STORE_REQUEST_SUCCESS,
      action: {
        deliveryGroupId: deliveryGroupId,
        notifications: serviceResponse.response.notifications
      }
    });
  }

  static handleSetStoreFailure(deliveryGroupId, serviceResponse) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_STORE_REQUEST_FAILURE,
      action: {
        deliveryGroupId: deliveryGroupId,
        errors: serviceResponse.response.errors
      }
    });
  }

}
