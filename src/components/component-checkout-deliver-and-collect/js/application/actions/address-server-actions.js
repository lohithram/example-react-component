import {
  ApplicationDispatcher,
  ContextualErrorActions,
  ServerStateActionTypes ,
  DeliverAndCollectActionTypes as ComponentActionTypes
} from '../class-library';

export default class AddressServerActions {

  static handleAddAddressResponseSuccess(response, contextIdentifier){
    ContextualErrorActions.clearErrors(contextIdentifier);
    ApplicationDispatcher.dispatch({
      actionType: ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE,
      action: {
        serverState: response.state
      }
    });
  }

  static handleAddAddressResponseFailure(response, contextIdentifier){
    ContextualErrorActions.receiveErrors(contextIdentifier, response.errors);
  }

  /**
   * handleRemoveAddressResponseSuccess
   * Handle the success response from the server
   */
  static handleRemoveAddressResponseSuccess(response, contextIdentifier){
    ContextualErrorActions.clearErrors(contextIdentifier);
    ApplicationDispatcher.dispatch({
      actionType: ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE,
      action: {
        serverState: response.state
      }
    });
  }

  /**
   * handleRemoveAddressResponseFailure
   * Handle the failure response from the server
   */
  static handleRemoveAddressResponseFailure(response, contextIdentifier){
    ContextualErrorActions.receiveErrors(contextIdentifier, response.errors);
  }

  /**
   * handleSetSelectedAddressResponseSuccess
   * Handle the success response from the server
   */
  static handleSetSelectedAddressResponseSuccess(response, contextIdentifier){
    ContextualErrorActions.clearErrors(contextIdentifier);
    ApplicationDispatcher.dispatch({
      actionType: ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE,
      action: {
        serverState: response.state
      }
    });
  }

  /**
   * handleSetSelectedAddressResponseFailure
   * Handle the failure response from the server
   */
  static handleSetSelectedAddressResponseFailure(response, contextIdentifier){
    ContextualErrorActions.receiveErrors(contextIdentifier, response.errors);
  }

}
