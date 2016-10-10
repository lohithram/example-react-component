
/************************************************************************
 * requires login store
 * This store contains the status of requiresLogin
 ************************************/
import $ from 'jquery';
import {
  ApplicationDispatcher,
  AbstractStore,
  DebugUtil,
  ServerStateActionTypes,
  UserActionTypes,
  UserTypes,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

class RequiresLoginStore extends AbstractStore {
  static initialState() {
    return {
      requiresLogin: false
    }
  }

  constructor(initialState=RequiresLoginStore.initialState()) {
    super(initialState);
    this._registerActionInterests();
  }

  _registerActionInterests() {
    this.dispatchToken = ApplicationDispatcher.register((payload) => {
      switch (payload.actionType) {

        case ComponentActionTypes.HYDRATE_LOCAL_STORES:
          this._hydrateFromInitialState(payload.action.initialState);
          // @note: Don't emit change here
          break;

        case ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE:
          this.state.requiresLogin = payload.action.serverState && typeof payload.action.serverState.requiresLogin !== "undefined" ? 
            payload.action.serverState.requiresLogin
            : false;
          this.emitChange();
          break;

        case UserActionTypes.RECEIVE_USER:
          if(payload.action.user && payload.action.user.userType !== UserTypes.AUTHENTICATED){
            this.state.requiresLogin = false;
          } else {
            this.state.requiresLogin = true;
          }
          this.emitChange();
          break;
      }
    });
  }

  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating requiresLogin store with", initialState);
    if(initialState && typeof initialState.requiresLogin !== "undefined"){
      this.state = $.extend(this.state, {
        requiresLogin: initialState.requiresLogin
      });
    }
  }


  getRequiresLogin() {
    return this.state.requiresLogin;
  }

  /**
   * resetStateForTest
   * Reset store state for test
   * Karma does not clear the state between tests so we have to clear it manually, we use this method to do so
   */
  resetStateForTest() {
    this.state = RequiresLoginStore.initialState();
  }
}

// Singleton instance
export default new RequiresLoginStore();
