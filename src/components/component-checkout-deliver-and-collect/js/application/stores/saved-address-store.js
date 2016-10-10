
/************************************************************************
 * Saved address store
 * This store will contain the currently saved store data
 ************************************/
import $ from 'jquery';
import {
  ApplicationDispatcher,
  AbstractStore,
  DebugUtil,
  ServerStateActionTypes,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

class SavedAddressStore extends AbstractStore {
  static initialState() {
    return {
      savedAddresses: []
    }
  }

  constructor(initialState=SavedAddressStore.initialState()) {
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
            ? this._replaceSavedAddresses(payload.action.serverState.savedAddresses)
            : this._replaceSavedAddresses([]);
          this.emitChange();
          break;

      }
    });
  }

  /**
   * _replaceSavedAddresses
   * Overwrite saved addresses
   */
  _replaceSavedAddresses(savedAddresses) {
    this.state.savedAddresses = savedAddresses || [];
  }

  /**
   * _hydrateFromInitialState
   * Hydrate from initial state
   */
  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating saved address store with", initialState);
    if(initialState && initialState.savedAddresses){
      this.state = $.extend(this.state, {
        savedAddresses: initialState.savedAddresses
      });
    }
  }

  /**
   * getSavedAddresses
   * Return all the saved addresses
   */
  getSavedAddresses() {
    return this.state.savedAddresses || [];
  }

  /**
   * getSavedAddress
   * Return a saved address
   */
  getSavedAddress(addressId) {
    const index = this.state.savedAddresses.findIndex((element, index, array) => { return element.address.addressId === addressId; });
    return this.state.savedAddresses[index] || null;
  }

  /**
   * resetStateForTest
   * Reset store state for test
   * Karma does not clear the state between tests so we have to clear it manually, we use this method to do so
   */
  resetStateForTest() {
    this.state = SavedAddressStore.initialState();
  }
}

// Singleton instance
export default new SavedAddressStore();
