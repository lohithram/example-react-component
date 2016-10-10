
/************************************************************************
 * Delivery groups notifications store
 * This store will contain the notifications which are for all combined delivery groups
 ************************************/

import $ from 'jquery';
import {
  ApplicationDispatcher,
  AbstractStore,
  DebugUtil,
  NotificationUtil,
  ServerStateActionTypes,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

class DeliveryGroupsNotificationsStore extends AbstractStore {
  static initialState() {
    return {
      notifications: []
    }
  }

  constructor(initialState=DeliveryGroupsNotificationsStore.initialState()) {
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
          if (payload.action.serverState && payload.action.serverState.notifications) {
            this._replaceNotifications(
              NotificationUtil.getNotificationsArray(payload.action.serverState.notifications));
          }
          else {
            this._replaceNotifications([]);
          }
          this.emitChange();
          break;

        case ServerStateActionTypes.SET_STORE_REQUEST_SUCCESS:
          this._replaceNotifications(
            NotificationUtil.getNotificationsArray(payload.action.notifications));
            this.emitChange();
          break;

        /**
         * Clear all delivery group notifications when status changes
         */
        case ComponentActionTypes.UPDATE_STATUS:
          this._replaceNotifications([]);
          this.emitChange();
          break;
      }
    });
  }

  /**
   * _replaceNotifications
   * Replace the state notifications property
   */
  _replaceNotifications(notifications) {
    this.state.notifications = notifications || [];
  }

  /**
   * _hydrateFromInitialState
   * Hydrate from initial state
   */
  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating notifications store with", initialState);
    if (initialState && initialState.notifications) {
      this.state = $.extend(this.state, {
        notifications: NotificationUtil.getNotificationsArray(initialState.notifications)
      });
    }
  }

  /**
   * getNotifications
   * Return the notifications
   */
  getNotifications() {
    return this.state.notifications;
  }

  /**
   * resetStateForTest
   * Reset store state for test
   * Karma does not clear the state between tests so we have to clear it manually, we use this method to do so
   */
  resetStateForTest() {
    this.state = DeliveryGroupsNotificationsStore.initialState();
  }
}

// Singleton instance
export default new DeliveryGroupsNotificationsStore();
