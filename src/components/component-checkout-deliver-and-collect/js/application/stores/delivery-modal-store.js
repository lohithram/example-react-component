import { AbstractStore, ApplicationDispatcher, DebugUtil, DeliverAndCollectActionTypes as ComponentActionTypes } from '../class-library';
import DeliveryModalTypes from "../constants/delivery-modal-types";

const MODAL_TYPE = 2;

class DeliveryModalStore extends AbstractStore {

  static initialState() {

    return { showModal: false,
             modalData: {},
             modalId: null,
             currentNotification: null };
  }

  constructor(initialState=DeliveryModalStore.initialState()) {

    super(initialState);
    this._registerActionInterests();
  }

  resetStateForTest(){
    this.state = DeliveryModalStore.initialState();
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
              break;
        case ComponentActionTypes.RECEIVE_NOTIFICATION_CONFIG:
              this._processNotificationConfig(payload.action.notificationConfig);
              break;
        case ComponentActionTypes.SHOW_MODAL:
              this._showModal(payload.action.modalId, payload.action.modalData);
              break;
        case ComponentActionTypes.CLOSE_MODAL:
              this._closeModal(payload.action.modalId);
              break;
        case ComponentActionTypes.RECEIVE_SERVER_STATE:
              this._onResponse(payload.action.serverState);
              break;
      }
    });
  }

  /**
   * _hydrateFromInitialState
   * Hydrate from initial state
   */
  _hydrateFromInitialState(initialState) {

    DebugUtil.log("Hydrating delivery modal store with", initialState);
    this.initialState = initialState;
    this._checkStateForNotification(this.initialState);
    this.emitChange();
  }

  _checkStateForNotification(state){
    if(!state) return;

    let modalData = null;
    let modalId = "";
    let modalActions;

    this._setNillNotification();
    if(state.incompatibleCartModal){

      this.state.showModal = true;
      modalData = state.incompatibleCartModal;
      modalId = DeliveryModalTypes.INCOMPATIBLE_CART
    }else if(state.itemsUnavailableModal){

      this.state.showModal = true;
      modalData = state.itemsUnavailableModal;
      modalId = DeliveryModalTypes.ITEMS_UNAVAILABLE;
    }else if(state.stockNotAvailableModal){

      this.state.showModal = true;
      modalData = state.stockNotAvailableModal;
      modalId = DeliveryModalTypes.STOCK_NOT_AVAILABLE;
    }

    this.state.modalData = modalData;
    this.state.modalId = modalId;

    DebugUtil.log("custom modal: ", modalData);
    DebugUtil.log("custom modal modalId: ", modalId);
  }

  /**
   * _processNotificationConfig
   * This method first looks into notificatonConfig to see if there are any
   * notification with type MODAL_TYPE. If there is one then,
   * pick up the key associated with that notificaton and search for modal data
   * in homeDelivery and clickAndCollection section of deliveryGroups
   */
  _processNotificationConfig(notificationConfig){

    if(this.state.showModal)
      return;

    let initialState = this.initialState;

    if(initialState && notificationConfig){

      let isModalNotificationPresent;
      const notificationKeys = Object.keys(notificationConfig);
      isModalNotificationPresent = notificationKeys.some((notificationKey) => {

        DebugUtil.log("Notification ", notificationConfig[notificationKey]);
        if(notificationConfig[notificationKey].type === MODAL_TYPE){

          this.state.modalId = DeliveryModalTypes.DEFAULT_MODAL;
          this.state.notificationKey = notificationKey;
          this.state.showModal = true;
          return true;
        }
        return false;
      });
      this.state.showModal = isModalNotificationPresent;
    }

    if(this.state.showModal){

      DebugUtil.log('Found notification key of type Modal - ', this.state.notificationKey);
      let modalData = this._getDefaultModalData(this.initialState, this.state.notificationKey);
      this.state.modalData = modalData;
    }
    DebugUtil.log("parseNotifications - ", this.state.notificationKey, this.state.modalData);
    this.emitChange();
  }

  _setNillNotification(){

    this.state.showModal = false;
    this.state.modalData = {};
    this.state.notificationKey = "";
    this.state.modalId = "";
  }

  /**
   * _getDefaultModalData
   * Search for the modal data
   * in homeDelivery and clickAndCollection section of deliveryGroup,
   * Return the first notificaiton data matching the notificaiton key
   */
  _getDefaultModalData(state, notificationKey){

    let modalData = null;
    let deliveryGroups = state.deliveryGroups;

    if(state.notifications){

      modalData =
          this._getDefaultModalDataFromList(state.notifications, notificationKey);
    }

    if(!modalData && deliveryGroups){

      deliveryGroups.some((deliveryGroup) => {

        if(deliveryGroup && deliveryGroup.homeDelivery && deliveryGroup.homeDelivery.notifications){

          modalData =
              this._getDefaultModalDataFromList(deliveryGroup.homeDelivery.notifications, notificationKey);
        }
        if(!modalData && deliveryGroup && deliveryGroup.clickAndCollect &&
                        deliveryGroup.clickAndCollect.notifications){

          modalData =
            this._getDefaultModalDataFromList(deliveryGroup.clickAndCollect.notifications, notificationKey);
        }
        return modalData != null;
      });
    }

    DebugUtil.log("getDefaultModalData - ", modalData);
    return modalData;
  }

  _getDefaultModalDataFromList(notifications, key){

    let modalData = null;

    if(notifications instanceof Array){

      notifications.some( (notification) => {

        DebugUtil.log("NotificatonDATA - ", notification);
        if(notification && notification.messageKey === key){

          modalData = this._constructDefaultModalData(notification.message, notification.closeLinkText);
        }
        return modalData != null;
      });
    }
    return modalData;
  }

  _constructDefaultModalData(notificationMessage, closeLinkText){

    return {
      content: notificationMessage,
      closeLinkText: closeLinkText
    }
  }

  /**
   * _onResponse
   * TODO: Need access to the entire response object
   */
   _onResponse(serverState){
     if(!serverState) return;

     this.initialState = serverState;
     this._checkStateForNotification(this.initialState);
     if(!this.state.showModal){
       this._processNotificationConfig(serverState.notificationConfig);
     }
     this.emitChange();
   }

  /**
   * _showModal
   *
   */
   _showModal(modalId, modalData){

     if(modalId && modalData){

       this.state.showModal = true;
       this.state.modalData = modalData;
       this.state.modalId = modalId;
       this.emitChange();
     }
   }

  /**
   * _closeModal
   *
   */
   _closeModal(modalId){

     if(this.state.modalId &&
       this.state.modalId.toLowerCase() === modalId.toLowerCase()){

         this.state.showModal = false;
         this.state.modalData = {};
         this.state.modalId = null;
         this.emitChange();
    }else{
      DebugUtil.log("Exception: UnRecognized modalId provided to closeModal", modalId );
    }
  }
}

export default new DeliveryModalStore();
