/************************************************************************
 * Searched store store
 * This store will contain the current searched stores for each delivery group
 ************************************/

import $ from 'jquery';
import {
  ApplicationDispatcher,
  AbstractStore,
  DebugUtil,
  ServerStateActionTypes,
  DeliverAndCollectActionTypes as ComponentActionTypes,
  DeliveryGroupStore
} from '../class-library';
import LocationResultsFilters from '../constants/location-results-filters';

class SearchedStoreStore extends AbstractStore {
  static initialState() {
    return {
      searchedStores: {}
    }
  }

  constructor(initialState=SearchedStoreStore.initialState()) {
    super(initialState);
    this._registerActionInterests();
  }

  /**
   * _registerActionInterests
   * Listen to all required actions
   */
  _registerActionInterests() {
    this.dispatchToken = ApplicationDispatcher.register((payload) => {

      switch (payload.actionType) {
        case ComponentActionTypes.HYDRATE_LOCAL_STORES:
          ApplicationDispatcher.waitFor([DeliveryGroupStore.dispatchToken]);
          this._hydrateFromInitialState(DeliveryGroupStore.getDeliveryGroups());
          break;

        case ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE:
          ApplicationDispatcher.waitFor([DeliveryGroupStore.dispatchToken]);
          this._updateState(DeliveryGroupStore.getDeliveryGroups());
          this.emitChange();
          break;

        case ComponentActionTypes.SEARCH_STORES_REQUEST_SUCCESS:
          this.state.searchedStores[payload.action.deliveryGroupId] = $.extend(this.state.searchedStores[payload.action.deliveryGroupId], {
            stores: payload.action.stores
          });
          this.emitChange();
          break;

        case ComponentActionTypes.SET_SEARCHED_STORES_TEXT:
          this.state.searchedStores[payload.action.deliveryGroupId] = $.extend(this.state.searchedStores[payload.action.deliveryGroupId], {
            searchedText: payload.action.searchedText
          });
          this.emitChange();
          break;

        case ComponentActionTypes.SET_SEARCHED_STORES_FILTER:
          this.state.searchedStores[payload.action.deliveryGroupId] = $.extend(this.state.searchedStores[payload.action.deliveryGroupId], {
            activeFilter: payload.action.activeFilter
          });
          this.emitChange();
          break;

        case ComponentActionTypes.SET_SEARCHED_STORES_VIEW_FILTER:
          this.state.searchedStores[payload.action.deliveryGroupId] = $.extend(this.state.searchedStores[payload.action.deliveryGroupId], {
            activeView: payload.action.activeView,
            activeStoreId: payload.action.storeId
          });
          this.emitChange();
          break;

        case ComponentActionTypes.SET_SEARCHED_STORE_COLLECTION_VALUE:
          this._updateStoreSelectedCollectionValue(payload.action.deliveryGroupId, payload.action.storeId, payload.action.value);
          this.emitChange();
          break;

        case ComponentActionTypes.SET_SELECTED_STORE:
          this.state.searchedStores[payload.action.deliveryGroupId] = $.extend(this.state.searchedStores[payload.action.deliveryGroupId], {
            activeStoreId: null
          });
          this.emitChange();
          break;
      }
    });
  }

  /**
   * _hydrateFromInitialState
   * Hydrate from initial state
   * @param {object} initialState
   */
  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating searched store store with", initialState);
    if(initialState){
      initialState.forEach(deliveryGroup => {
        const { deliveryGroupId, clickAndCollect } = deliveryGroup;
        this.state.searchedStores[deliveryGroupId] = {
          activeView: 0,
          activeFilter: 0,
          stores: clickAndCollect ? clickAndCollect.listOfStores : []
        };
      });
    }
  }

  /**
   * _updateState
   * Updates state from received delivery groups derived data
   * @param {object} updatedState
   */
  _updateState(updatedState) {
    DebugUtil.log("Updating searched store store with", updatedState);
    if(updatedState){
      updatedState.forEach(deliveryGroup => {
        const { deliveryGroupId, clickAndCollect } = deliveryGroup;
        this.state.searchedStores[deliveryGroupId] = $.extend(this.state.searchedStores[deliveryGroupId], {
          stores: clickAndCollect ? clickAndCollect.listOfStores : []
        });
      });
    }
  }

  _updateStoreSelectedCollectionValue(deliveryGroupId, storeId, value) {
    const deliveryGroup = this.state.searchedStores[deliveryGroupId];
    if (deliveryGroup) {
      deliveryGroup.stores.find((store, index) => {
        if (store.storeId === storeId && store.collectFrom) {
          store.collectFrom
            .filter(x => x.fieldOptions)
            .forEach(field=> {
              field.fieldOptions.forEach(f => {
                f.selected = f.value === value
              });
            });

          deliveryGroup.stores[index] = store;
        }
      });
      this.state.searchedStores[deliveryGroupId] = deliveryGroup;
    }
  }

  /**
   * getSearchedStores
   * @returns {object} dictionary of searched stores
   */
  getSearchedStores() {
    return this.state.searchedStores;
  }

  /**
   * getStoresForDeliveryGroup
   * @param {string} deliveryGroupId
   * @returns {array} array of searched store results
   */
  getStoresForDeliveryGroup(deliveryGroupId) {
    let result = this.state.searchedStores[deliveryGroupId];
    return result ? result.stores : [];
  }

  /**
   * getStoreByIdForDeliveryGroup
   * @param {string} deliveryGroupId
   * @param {string} storeId
   * @returns {object} specific store object
   */
  getStoreByIdForDeliveryGroup(deliveryGroupId, storeId) {
    let stores = this.getStoresForDeliveryGroup(deliveryGroupId);
    return stores.find(store => store.storeId === storeId) || null;
  }

  /**
   * getFilteredStoresForDeliveryGroup
   * @param {string} deliveryGroupId
   * @returns {object} object of filtered searched stores
   */
  getFilteredStoresForDeliveryGroup(deliveryGroupId) {
    let result = this.state.searchedStores[deliveryGroupId];

    if(!result) {
      return {};
    }

    if (result.activeFilter === LocationResultsFilters.All_LOCATIONS) {
      return result;
    }

    return {
      ...result,
      stores: result.stores.filter(store => {
        return store.isFalabellaStore;
      })
    };
  }

  /**
   * getLocationSearchForm
   * @param {string} deliveryGroupId
   */
  getLocationSearchForm(deliveryGroupId) {
    let result = this.state.searchedStores[deliveryGroupId];

    if(!result && !result.locationSearchForm) {
      return null;
    }

    return result.locationSearchForm;
  }

  /**
   * resetStateForTest
   * Reset store state for test
   * Karma does not clear the state between tests so we have to clear it manually, we use this method to do so
   */
  resetStateForTest() {
    this.state = SearchedStoreStore.initialState();
  }

}

// Singleton instance
export default new SearchedStoreStore();
