
import {
  ApplicationDispatcher,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

export default class SelectedStoreStoreActions {

  static setSelectedStore(deliveryGroupId, store){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SELECTED_STORE,
      action: { deliveryGroupId, store }
    });
  }

  static removeSelectedStore(deliveryGroupId) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.REMOVE_SELECTED_STORE,
      action: { deliveryGroupId }
    });
  }

  static setSelectedStoreCollectionValue(deliveryGroupId, value) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SELECTED_STORE_COLLECTION_VALUE,
      action: { deliveryGroupId, value }
    });
  }

}
