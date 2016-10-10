
/************************************************************************
 * Saved store store
 * This store will contain the currently saved store
 ************************************/

import $ from 'jquery';
import {
  ApplicationDispatcher,
  AbstractStore,
  DebugUtil,
  ServerStateActionTypes,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

class SavedStoreStore extends AbstractStore {
  static initialState() {
    return {
      savedStore: null
    }
  }

  constructor(initialState=SavedStoreStore.initialState()) {
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
          this._hydrateFromInitialState(payload.action.initialState);
          // @note: Don't emit change here
          break;

        case ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE:
          payload.action.serverState
            ? this._replaceSavedStore(payload.action.serverState.savedStore)
            : this._replaceSavedStore(null);
          this.emitChange();
          break;
      }
    });
  }

  /**
   * _hydrateFromInitialState
   * Hydrate from initial state
   */
  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating saved address store with", initialState);
    if(initialState && initialState.savedStore){
      this.state = $.extend(this.state, {
        savedStore: initialState.savedStore
      });
    }
  }

  /**
   * _replaceSavedStore
   * Replace the state saved store property
   */
  _replaceSavedStore(savedStore){
    this.state.savedStore = savedStore || null;
  }

  /**
   * getSavedStore
   * Return the saved store
   */
  getSavedStore() {
    return this.state.savedStore;
  }

  /**
   * resetStateForTest
   * Reset store state for test
   * Karma does not clear the state between tests so we have to clear it manually, we use this method to do so
   */
  resetStateForTest() {
    this.state = SavedStoreStore.initialState();
  }
}

// Singleton instance
export default new SavedStoreStore();
