import React, { Component, PropTypes } from 'react';
import AddressActions from '../../actions/address-actions';
import { RequiresLoginStore } from '../../stores/stores';
import {
  AddressForm,
  ApplicationDispatcher,
  ClassNameUtil,
  FormStore,
  FormActions,
  DeliverToAddressStatusStore,
  DeliverToAddressStatusTypes,
  DeliverAndCollectFormIdentifier as FormIdentifier,
  SessionActions
} from '../../class-library';

export default class AddressFormContainer extends Component{

  constructor(props){
    super(props);
    this._bindHandlers();
    this.state = this._buildStateFromStores();
  }

  componentDidMount(){
    this.mounted = true;
    this._addStoreListeners();
  }

  componentWillUnmount(){
    this.mounted = false;
    this._removeStoreListeners();
  }

  _bindHandlers(){
    this._handleStoreChange = this._handleStoreChange.bind(this);
    this._handleUseAddress = this._handleUseAddress.bind(this);
    this._handleEditLocation = this._handleEditLocation.bind(this);
    this._handleLocationFieldChange = this._handleLocationFieldChange.bind(this);
    this._handleFormChange = this._handleFormChange.bind(this);
  }

  _buildStateFromStores(){
    const addressForm = FormStore.getForm(FormIdentifier.ADDRESS_FORM);
    const { addressFields = [], locationFields = [], showMoreText = '', showLessText = '', hideAfter = 0 } = addressForm || {};
    const deliverToAddressStatus = DeliverToAddressStatusStore.getStatus();
    const requiresLogin = RequiresLoginStore.getRequiresLogin();

    return {
      deliverToAddressStatus,
      addressFields,
      locationFields,
      showMoreText,
      showLessText,
      hideAfter,
      requiresLogin
    }
  }

  // returns true/false depending on current delivery address status code
  _getShowLocationsAsText(){
    const showAsTextStatuses = [
      DeliverToAddressStatusTypes.GUEST_WITH_LOCATION_OR_AUTHORISED_WITH_LOCATION_NO_SAVED_ADDRESSES,
      DeliverToAddressStatusTypes.GUEST_WITH_ADDRESS_OR_AUTHORISED_WITH_ADDRESS_NO_SAVED_ADDRESSES,
      DeliverToAddressStatusTypes.AUTHORISED_WITH_ADDRESS_SAVED_ADDRESSES,
      DeliverToAddressStatusTypes.AUTHORISED_NO_ADDRESS_NO_SAVED_ADDRESSES_PREFERRED_STORE_DEFAULT_DELIVERY_CLICK_AND_COLLECT
    ];
    return showAsTextStatuses.indexOf(this.state.deliverToAddressStatus) >= 0;
  }

  _addStoreListeners(){
    this.formStoreListener = FormStore.addChangeListener(this._handleStoreChange);
    this.deliverToAddressStatusStoreListener = DeliverToAddressStatusStore.addChangeListener(this._handleStoreChange);
    this.requiresLoginStoreListener = RequiresLoginStore.addChangeListener(this._handleStoreChange);
  }

  _removeStoreListeners(){
    if(this.formStoreListener)
      this.formStoreListener.dispose();

    if(this.deliverToAddressStatusStoreListener)
      this.deliverToAddressStatusStoreListener.dispose();

    if(this.requiresLoginStoreListener)
      this.requiresLoginStoreListener.dispose();
  }

  _handleStoreChange(){
    if(this.mounted){
      this.setState(this._buildStateFromStores());
    }
  }

  _handleFormChange(obj){
    FormActions.changeFormFieldValue(FormIdentifier.ADDRESS_FORM, obj.name, obj.value);
  }

  _handleLocationFieldChange(obj){
    // Firstly, call the normal form change handler
    this._handleFormChange(obj);

    // Then also call submitCustomerDivision
    const addressForm = FormStore.getForm(FormIdentifier.ADDRESS_FORM);
    const formSubmissionData = FormStore.getSerializedData(FormIdentifier.ADDRESS_FORM);
    AddressActions.submitCustomerDivision(formSubmissionData, addressForm, this.props.endPoints, FormIdentifier.ADDRESS_FORM, obj.name)
  }

  _handleUseAddress(){
    let addAddress = () => {
      const formContext = FormIdentifier.ADDRESS_FORM;
      const formData = FormStore.getSerializedData(formContext);
      const validationRules = FormStore.getValidationRules(formContext);
      AddressActions.addAddress(formContext, formData, validationRules, this.props.endPoints, this.contextIdentifier);
    };

    if(this.state.requiresLogin){
      SessionActions.promptToSignIn({ modal: true }).then(addAddress);
    } else {
      addAddress();
    }
  }

  _handleEditLocation(){
    AddressActions.editLocation();
  }

  render(){
    const { addressFields, locationFields, showMoreText, showLessText, hideAfter } = this.state;
    const showLocationAsText = this._getShowLocationsAsText();

    return(
      <div className={ClassNameUtil.getClassNames(['fbra_addressFormContainer', 'fbra_test_addressFormContainer'])}>
        <AddressForm
          formContext={FormIdentifier.ADDRESS_FORM}
          addressFields={addressFields}
          locationFields={locationFields}
          showMoreText={showMoreText}
          showLessText={showLessText}
          hideAfter={hideAfter}
          showLocationAsText={showLocationAsText}
          onUseAddress={this._handleUseAddress}
          onEditLocation={this._handleEditLocation}
          onLocationFieldChange={this._handleLocationFieldChange}
          onAddressFieldChange={this._handleFormChange}
        />
      </div>
    );
  }

}
AddressFormContainer.propTypes = {
  textDictionary: PropTypes.object.isRequired,
  endPoints: PropTypes.object.isRequired
}
