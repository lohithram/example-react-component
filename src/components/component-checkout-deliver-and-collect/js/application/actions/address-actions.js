import { ApplicationDispatcher, WebServiceUtil, DebugUtil, FormActions, DeliverAndCollectActionTypes as ComponentActionTypes, ValidatorUtil, CascadedRegionAndComunaActions, FormStore, DeliverToAddressStatusStore, DeliverToAddressStatusTypes } from '../class-library';
import AddressServerActions from './address-server-actions';
import DeliverToAddressStatusActions from '../actions/deliver-to-address-status-actions';

export default class AddressActions {
	/**
	 * removeSavedAddress
	 * Remove a saved address
	 */
  static removeSavedAddress(addressId, endPoints, requestContext = "") {
  	DebugUtil.log("Removing address", addressId, endPoints, requestContext);

    WebServiceUtil.makeWebServiceRequest(
      endPoints.removeAddress.path, endPoints.removeAddress.type, {
      	addressId: addressId
      }, 'fbra_removeAddress')
    .then(
      (resolution) => {
        if (resolution.response.success === true) {
          AddressServerActions.handleRemoveAddressResponseSuccess(resolution.response, requestContext);
        } else {
          AddressServerActions.handleRemoveAddressResponseFailure(resolution.response, requestContext);
        }
      },
      (rejection) => {
        AddressServerActions.handleRemoveAddressResponseFailure(rejection.response, requestContext);
      }
    );
  }

  /**
	 * changeFormFieldValue
	 * Dispatches an action to notify stores of address form field changes
	 */
  static changeFormFieldValue(name, value){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.ADDRESS_FORM_FIELD_CHANGE,
      action: { name, value }
    });
  }

  /**
  * addAddress
  * Add a new address
  */
  static addAddress(formContext, formData, validationRules, endPoints, contextIdentifier){
    if(!FormActions.validateForm(formContext, formData, validationRules)) return;

    const postData = { formSubmissionData: formData };
    WebServiceUtil.makeWebServiceRequest(endPoints.addAddress.path, endPoints.addAddress.type, postData, 'fbra_addAddress')
    .then(result => {
       if (!result.response.success === true) throw result;
       AddressServerActions.handleAddAddressResponseSuccess(result.response, contextIdentifier);
    })
    .catch(({ response }) => {
       FormActions.receiveServerFormValidationErrors(ValidatorUtil.normaliseServerErrors(response.errors, formContext));
       AddressServerActions.handleAddAddressResponseFailure(response, contextIdentifier);
    });
  }

  static setSelectedAddress(addressId, endPoints, contextIdentifier){
    const data = {
      addressId
    };
    WebServiceUtil.makeWebServiceRequest(endPoints.setSelectedAddress.path, endPoints.setSelectedAddress.type, data, 'fbra_setSelectedAddress')
    .then(
      (resolution) => {
        if (resolution.response.success === true) {
          AddressServerActions.handleSetSelectedAddressResponseSuccess(resolution.response, contextIdentifier);
        } else {
          AddressServerActions.handleSetSelectedAddressResponseFailure(resolution.response, contextIdentifier);
        }
      },
      (rejection) => {
        AddressServerActions.handleSetSelectedAddressResponseFailure(rejection.response, contextIdentifier);
      }
    )
  }

  /**
	 * editLocation
	 * Edit the location portion of an address (i.e; Region & comuna)
	 */
  static editLocation(){
    const deliverToAddressStatus = DeliverToAddressStatusStore.getStatus();
    let desiredStatus;
    switch(deliverToAddressStatus){

      case DeliverToAddressStatusTypes.GUEST_WITH_LOCATION_OR_AUTHORISED_WITH_LOCATION_NO_SAVED_ADDRESSES:
        desiredStatus = DeliverToAddressStatusTypes.GUEST_WITH_NO_LOCATION;
        DeliverToAddressStatusActions.changeStatus(desiredStatus);
        break;

      case DeliverToAddressStatusTypes.GUEST_WITH_ADDRESS_OR_AUTHORISED_WITH_ADDRESS_NO_SAVED_ADDRESSES:
        desiredStatus = DeliverToAddressStatusTypes.GUEST_WITH_LOCATION_OR_AUTHORISED_WITH_LOCATION_NO_SAVED_ADDRESSES;
        DeliverToAddressStatusActions.changeStatus(desiredStatus);
        break;

      case DeliverToAddressStatusTypes.AUTHORISED_WITH_ADDRESS_SAVED_ADDRESSES:
        desiredStatus = DeliverToAddressStatusTypes.AUTHORISED_NO_ADDRESS_SAVED_ADDRESSES_DEFAULT_DELIVERY_ANY;
        DeliverToAddressStatusActions.changeStatus(desiredStatus);
        break;
    }
  }

  /**
   * 4.1.6.2 Editar button
   *
   * Essentially discards the order address and requires the user to either pick
   * another from their address book (if they have one) or enter a new address
   * in the address form.
   *
   * If the user is signed in and has saved addresses (status 4), show the
   * address book (status 5).
   *
   * Else set status to 2, address form with location selected but no order
   * address.
   *
   */
  static editAddress() {
    const deliverToAddressStatus = DeliverToAddressStatusStore.getStatus();
    let desiredStatus;
    switch(deliverToAddressStatus) {
      case DeliverToAddressStatusTypes.AUTHORISED_WITH_ADDRESS_SAVED_ADDRESSES:
        desiredStatus = DeliverToAddressStatusTypes.AUTHORISED_NO_ADDRESS_SAVED_ADDRESSES_DEFAULT_DELIVERY_ANY;
        DeliverToAddressStatusActions.changeStatus(desiredStatus);
        break;

      default:
        desiredStatus = DeliverToAddressStatusTypes.GUEST_WITH_LOCATION_OR_AUTHORISED_WITH_LOCATION_NO_SAVED_ADDRESSES;
        DeliverToAddressStatusActions.changeStatus(desiredStatus);
        break;
    }
  }

  static submitCustomerDivision(formSubmissionData, addressForm, endPoints, contextIdentifier, fieldName) {
    WebServiceUtil.makeWebServiceRequest(
      endPoints.submitCustomerDivision.path,
      endPoints.submitCustomerDivision.type,
      { formSubmissionData },
      "fbra_submitCustomerDivision"
    )
      .then(
        resolution => resolution.response.success
        ? CascadedRegionAndComunaActions.handleSubmitCustomerDivision(resolution.response.fieldOptions, addressForm, contextIdentifier, fieldName)
        : AddressServerActions.handleSetSelectedAddressResponseFailure(resolution.response, contextIdentifier),
        rejection => AddressServerActions.handleSetSelectedAddressResponseFailure(rejection.response, contextIdentifier)
      );
    }
}
