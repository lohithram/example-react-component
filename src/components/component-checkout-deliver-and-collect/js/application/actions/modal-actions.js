
/************************************************************************
 * ModalActions
 * Actions related to the Modal management
 *********************************************************************/

import { ApplicationDispatcher, WebServiceUtil, DebugUtil, ServerStateActionTypes,  DeliverAndCollectActionTypes as ComponentActionTypes } from '../class-library';

export default class ModalActions {

	/**
	 * showModal
	 *
	 */
	static showModal(modalId, modalData) {

    ApplicationDispatcher.dispatch({
			actionType: ComponentActionTypes.SHOW_MODAL,
			action: {
				modalId: modalId,
				modalData: modalData
			}
		});
  }

	/**
	 * closeModal
	 *
	 */
	static closeModal(modalId) {

		ApplicationDispatcher.dispatch({
			actionType: ComponentActionTypes.CLOSE_MODAL,
			action: {
				modalId: modalId
			}
		});
	}

	/**
	 * continueWithAvailableItems
	 * @param payload {object} serialised form data
	 * @param endPoints {object} API endpoints
	 * @param context {string} randomised context value
	 */
	static continueWithAvailableItems(payload, endPoints, context){
		this._makeWebRequest(payload, endPoints.submitItemsNotAvailable, 'fbra_submitItemsNotAvailableResponse')
		.then((resolution) => this._requestResolved(context, resolution.response),
			(rejection) => this._requestRejected(context, rejection));
	}

	/**
	 * continueWithTheCompatibleItems
	 * @param payload {object} serialised form data
	 * @param endPoints {object} API endpoints
	 * @param context {string} randomised context value
	 */
	static continueWithTheCompatibleItems(payload, endPoints, context){
		this._makeWebRequest(payload, endPoints.submitIncompatibleCart, 'fbra_submitIncompatibleCartResponse')
		.then((resolution) => this._requestResolved(context, resolution.response),
			(rejection) => this._requestRejected(context, rejection));
	}

	/**
	 * continueWithProposedQuantities
	 * @param payload {object} serialised form data
	 * @param endPoints {object} API endpoints
	 * @param context {string} randomised context value
	 */
	static continueWithProposedQuantities(payload, endPoints, context){
		this._makeWebRequest(payload, endPoints.submitStockNotAvailable, 'fbra_submitStockNotAvailableResponse')
		.then((resolution) => this._requestResolved(context, resolution.response),
			(rejection) => this._requestRejected(context, rejection));
	}

	/**
	 * cancelProposedQuantities
	 */
	static cancelProposedQuantities(){
		// TODO: Wire - up to the appropriate endpoint
		DebugUtil.log("cancelProposedQuantities");
	}

	/**
	 * _makeWebRequest convenience method
	 */
	static _makeWebRequest(payload, endPoint, id) {
		return WebServiceUtil.makeWebServiceRequest(
				endPoint.path,
				endPoint.type,
				payload,
				id);
	}

	/**
	 * _requestResolved convenience method to handle web request resolved for modal actions
	 */
	static _requestResolved(context, response) {
		if (response.success && response.state) {
			ApplicationDispatcher.dispatch({
		    actionType: ServerStateActionTypes.RECEIVE_CHECKOUT_DELIVER_AND_COLLECT_SERVER_STATE,
		    action: { context, serverState: response.state }
		  });
		}
	}

	/**
	 * _requestResolved convenience method to handle web request rejected for modal actions
	 */
	static _requestRejected(context, rejection) {
		// @TODO: handle failed request
	}
}
