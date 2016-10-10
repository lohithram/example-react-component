import {
  ApplicationDispatcher,
  WebServiceUtil,
  FormActions,
  DeliverAndCollectActionTypes as ComponentActionTypes,
  ValidatorUtil
} from '../class-library';
import ClickAndCollectServerActions from './click-and-collect-server-actions';
import SearchedStoreStoreActions from './searched-store-store-actions';
import SelectedStoreStoreActions from './selected-store-store-actions';
export default class ClickAndCollectActions {

  static changeWhoWillCollectFormField(deliveryGroupId, name, value) {
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.CHANGE_WHO_WILL_COLLECT_FORM_FIELD,
      action: { deliveryGroupId, name, value }
    });
  }

  static searchStores(formContext, formData, validationRules, deliveryGroupId, endPoints) {

    if(!FormActions.validateForm(formContext, formData, validationRules)){
      return;
    }

    let postData = $.extend({}, formData, {deliveryGroupId: deliveryGroupId});

    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SEARCH_STORES_REQUEST_START,
      action: { }
    });

    WebServiceUtil.makeWebServiceRequest(
      endPoints.submitClickAndCollectTerm.path,
      endPoints.submitClickAndCollectTerm.type,
      postData,
      'fbra_searchStoresResponse')
      .then(result => {
        if (!result.response.success) throw result;
        ClickAndCollectServerActions.handleSearchStoresSuccess(deliveryGroupId, result);
        SearchedStoreStoreActions.setSearchedStoresText(deliveryGroupId, searchText);
      })
      .catch(result =>  {
        FormActions.receiveServerFormValidationErrors(ValidatorUtil.normaliseServerErrors(result.response.errors, formContext));
        ClickAndCollectServerActions.handleSearchStoresFailure(deliveryGroupId, result);
      });
  }

  static searchStoresLatLng(formContext, formData, validationRules, deliveryGroupId, lat, lng, endPoints){

    if(!FormActions.validateForm(formContext, formData, validationRules)){
      return;
    }

    const data = {
      deliveryGroupId,
      latitude: lat,
      longitude: lng
    }

    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SEARCH_STORES_REQUEST_START,
      action: { }
    });
    
    WebServiceUtil.makeWebServiceRequest(
      endPoints.submitClickAndCollectLocation.path,
      endPoints.submitClickAndCollectLocation.type,
      data,
      'fbra_searchStoresResponse')
    .then(result => {
      if (!result.response.success) throw result;
      ClickAndCollectServerActions.handleSearchStoresSuccess(deliveryGroupId, result);
      SearchedStoreStoreActions.setSearchedStoresText(deliveryGroupId, formData.locationSearchText || [lat, lng].join(', '));
    })
    .catch(result =>  {
      FormActions.receiveServerFormValidationErrors(ValidatorUtil.normaliseServerErrors(result.response.errors, formContext));
      ClickAndCollectServerActions.handleSearchStoresFailure(deliveryGroupId, result);
    });
  }

  static setSelectedStore(deliveryGroupId, storeId, collectFrom, endPoints) {
    let data = {
      deliveryGroupId: deliveryGroupId,
      storeId: storeId,
      collectFrom: collectFrom
    }

    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.SET_STORE_REQUEST_START,
      action: { }
    });

    WebServiceUtil.makeWebServiceRequest(
      endPoints.submitClickAndCollectStoreSelection.path,
      endPoints.submitClickAndCollectStoreSelection.type,
      data,
      'fbra_setStoreResponse')
    .then(
      (resolution) => {
        ClickAndCollectServerActions.handleSetStoreSuccess(deliveryGroupId, resolution);
      },
      (rejection) => {
        ClickAndCollectServerActions.handleSetStoreFailure(deliveryGroupId, rejection);
      }
    )
  }

  static unselectAndLatLongSearchForStore(deliveryGroupId, lat, lng, endPoints) {
    SelectedStoreStoreActions.removeSelectedStore(deliveryGroupId);
    ClickAndCollectActions.searchStoresLatLng(deliveryGroupId, null, lat, lng, endPoints);
  }

}
