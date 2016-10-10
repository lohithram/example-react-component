
/************************************************************************
 * ComponentActions
 * Component specific actions for the deliver and collect component
 ************************************/

import {
	ApplicationDispatcher,
	ContextualErrorActions,
	DeliverAndCollectActionTypes as ComponentActionTypes,
	DeliverAndCollectFormIdentifier as FormIdentifier,
	FormActions,
	ObjectUtil,
	ServerStateActionTypes
} from '../class-library';

export default class ComponentServerActions {

	static handleGetStateSuccessResponse(response, contextIdentifer) {
		ContextualErrorActions.clearErrors(contextIdentifer);
		ApplicationDispatcher.dispatch({
			actionType: ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE,
			action: {
				serverState: response.state
			}
		});

		// This response should contain an addressForm, make sure we update the form store
		const addressForm = ObjectUtil.path(['state', 'addressForm'], response);
		if (addressForm) FormActions.receiveForm(FormIdentifier.ADDRESS_FORM, addressForm);
	}

	static handleGetStateFailureResponse(response, contextIdentifer){
		ContextualErrorActions.receiveErrors(contextIdentifer, response.errors);
	}

}
