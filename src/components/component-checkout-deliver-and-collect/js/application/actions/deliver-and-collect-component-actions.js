
/************************************************************************
 * ComponentActions
 * Component specific actions for the deliver and collect component
 ************************************/

import {
	ApplicationDispatcher,
	DebugUtil,
	DeliverAndCollectActionTypes as ComponentActionTypes,
	DeliverAndCollectFormIdentifier as FormIdentifier,
	FormActions,
	WebServiceUtil,
	NotificationActionTypes
} from '../class-library';

import ComponentServerActions from './deliver-and-collect-component-server-actions';

export default class ComponentActions {
	/**
	 * receiveComponentConfig
	 * Set global store properties and hydrate all local stores
	 */
	static receiveComponentConfig(config) {
		DebugUtil.log("Creating actions to distribute component config:", config);

		ComponentActions.hydrateLocalStores(config.initialState);
		ComponentActions.receiveNotificationConfig(config.notificationConfig);
		ComponentActions.receiveAddressForm(config);

		if (config.validationRules) {
			(config.initialState.deliveryGroups || []).forEach(({deliveryGroupId}) => {
				FormActions.receiveValidationRules(FormIdentifier.locationSearchForm(deliveryGroupId),   config.validationRules.locationSearchForm);
				FormActions.receiveValidationRules(FormIdentifier.deliveryInstructions(deliveryGroupId), config.validationRules.deliveryInstructions);
				FormActions.receiveValidationRules(FormIdentifier.whoWillCollect(deliveryGroupId),       config.validationRules.whoWillCollect);
			});
		}
	}

	static receiveAddressForm(config){
		if(config.initialState.addressForm){
			FormActions.receiveForm(FormIdentifier.ADDRESS_FORM,
                              config.initialState.addressForm,
                              config.validationRules && config.validationRules.addressForm);
		}
	}

	/**
	 * hydrateLocalStores
	 * Hydrate the local stores from initial state
	 */
	static hydrateLocalStores(initialState) {
		DebugUtil.log("Hydrating local stores", initialState);
		ApplicationDispatcher.dispatch({
			actionType: ComponentActionTypes.HYDRATE_LOCAL_STORES,
			action: {
				initialState: initialState
			}
		});
	}

	/**
	 * receiveNotificationConfig
	 * Hydrate the local stores from initial state
	 */
	static receiveNotificationConfig(notificationConfig) {
		DebugUtil.log("Broadcasting notificationConfig", notificationConfig);
		ApplicationDispatcher.dispatch({
			actionType: NotificationActionTypes.RECEIVE_NOTIFICATION_CONFIG,
			action: {
				notificationConfig: notificationConfig
			}
		});
	}

	static getServerState(endPoints, contextIdentifer){
		WebServiceUtil.makeWebServiceRequest(endPoints.getState.path, endPoints.getState.type, {}, "fbra_getState")
		.then(
			(resolution) => {
				if(resolution.response.success === true){
					ComponentServerActions.handleGetStateSuccessResponse(resolution.response, contextIdentifer);
				}else{
					ComponentServerActions.handleGetStateFailureResponse(resolution.response, contextIdentifer);
				}
			},
			(rejection) => {
				ComponentServerActions.handleGetStateFailureResponse(rejection.response, contextIdentifer);
			}
		);
	}

}
