import {
  ApplicationDispatcher,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

export default class SearchedStoreStoreActions {

  static setSearchedStoresText(deliveryGroupId, searchedText){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SEARCHED_STORES_TEXT,
      action: { deliveryGroupId, searchedText }
    });
  }

  static setSearchedStoresFilter(deliveryGroupId, activeFilter){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SEARCHED_STORES_FILTER,
      action: { deliveryGroupId, activeFilter }
    });
  }

  static setSearchedStoresViewFilter(deliveryGroupId, activeView, storeId){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SEARCHED_STORES_VIEW_FILTER,
      action: { deliveryGroupId, activeView, storeId }
    });
  }

  static setSearchedStoreCollectionValue(deliveryGroupId, storeId, value) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_SEARCHED_STORE_COLLECTION_VALUE,
      action: { deliveryGroupId, storeId, value }
    });
  }

}
