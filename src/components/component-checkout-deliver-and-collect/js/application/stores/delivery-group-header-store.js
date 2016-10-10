import { ApplicationDispatcher, DebugUtil, AbstractStore } from '../class-library';
import DeliveryGroupHeaderActionTypes from '../constants/delivery-group-actions'

class DeliveryGroupHeaderStore extends AbstractStore {

  static initialState(){
    return {
      deliveryGroups:
    }
  }

  constructor(state=DeliverySummaryStore.initialState()) {
    super(state);
    this._registerActionInterests();
  }

  getDeliveryGroupHeader(){
    return this.state && this.state.deliveryGroups? this.state.deliveryGroups : null;
  }

  _registerActionInterests() {
    this.dispatchToken = ApplicationDispatcher.register((payload) => {
      switch (payload.actionType) {
        case DeliveryGroupHeaderActionTypes.HYDRATE_LOCAL_STORES:
          this._hydrateFromInitialState(payload.action.initialState);
          break;
        case DeliveryGroupHeaderActionTypes.REMOVE_DELIVERY_GROUP_HEADER_ERROR:
          break;
      }
    });
  }

  _hydrateFromInitialState(initialState) {
    DebugUtil.log("Hydrating delviery summary store");
    this.state = initialState; // @note: Don't emit change here
  }

  resetStateForTest(){
    this.state = DeliveryGroupHeaderStore.initialState();
  }
}

export default new DeliveryGroupHeaderStore();
