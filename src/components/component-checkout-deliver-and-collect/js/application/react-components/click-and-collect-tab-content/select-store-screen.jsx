import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  DeliverAndCollectFormIdentifier as FormIdentifier,
  FormStore,
  Heading,
  InlineNotification,
  Section,
  StringUtil
} from '../../class-library';
import { SearchStores, StoreResultsFilter, StoreResultsList, StoreResultsMap, AdditionalInfo } from './click-and-collect';
import SearchedStoreStoreActions from '../../actions/searched-store-store-actions';
import SelectedStoreStoreActions from '../../actions/selected-store-store-actions';
import ClickAndCollectActions from '../../actions/click-and-collect-actions';
import LocationResultsFilters from '../../constants/location-results-filters';

export default class SelectStoreScreen extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
    this.state = {
      pageSize: props.defaultPageSize
    };
  }

  bindHandlers() {
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleViewFilterChange = this.handleViewFilterChange.bind(this);
    this.handleMapMarkerClick = this.handleMapMarkerClick.bind(this);
    this.handleMapAndOpeningHoursLinkClick = this.handleMapAndOpeningHoursLinkClick.bind(this);
    this.handleCollectingYourOrderClick = this.handleCollectingYourOrderClick.bind(this);
    this.handleViewMoreClick = this.handleViewMoreClick.bind(this);
    this.handleSelectStoreButtonClick = this.handleSelectStoreButtonClick.bind(this);
    this.handleCollectionTimeChange = this.handleCollectionTimeChange.bind(this);
  }


  handleSearchSubmit(searchedText, coordinates) {
    const { deliveryGroupId, endPoints, useGoogleMapsAPI } = this.props;
    const formContext = FormIdentifier.locationSearchForm(deliveryGroupId);
    const validationRules = FormStore.getValidationRules(formContext);
    const formData = { locationSearchText: searchedText };

    if(coordinates && useGoogleMapsAPI) {
      ClickAndCollectActions.searchStoresLatLng(formContext, formData, validationRules, deliveryGroupId, coordinates.lat, coordinates.lng, endPoints);
      return;
    }

    ClickAndCollectActions.searchStores(formContext, formData, validationRules, deliveryGroupId, endPoints);
  }

  handleFilterChange(activeFilter) {
    SearchedStoreStoreActions.setSearchedStoresFilter(this.props.deliveryGroupId, activeFilter);
  }

  handleViewFilterChange(activeView) {
    SearchedStoreStoreActions.setSearchedStoresViewFilter(this.props.deliveryGroupId, activeView, null);
  }

  handleMapMarkerClick(storeId) {
    SearchedStoreStoreActions.setSearchedStoresViewFilter(this.props.deliveryGroupId, LocationResultsFilters.MAP_VIEW, storeId);
  }

  handleMapAndOpeningHoursLinkClick(storeId) {
    SearchedStoreStoreActions.setSearchedStoresViewFilter(this.props.deliveryGroupId, LocationResultsFilters.MAP_VIEW, storeId);
  }

  handleCollectingYourOrderClick() {
    // @todo: load the target in a modal?
  }

  handleViewMoreClick() {
    this.setState({
      pageSize: this.props.stores.length
    });
  }

  handleSelectStoreButtonClick(storeId) {
    const { deliveryGroupId, stores, endPoints } = this.props;
    const store = stores.find(store => store.storeId === storeId);
    const collectFrom = store.collectFrom && store.collectFrom.fieldOptions ?
                          store.collectFrom.fieldOptions.find(value => value.selected === true).value : null;
    SelectedStoreStoreActions.setSelectedStore(deliveryGroupId, store);
    ClickAndCollectActions.setSelectedStore(deliveryGroupId, storeId, collectFrom, endPoints);
  }

  handleCollectionTimeChange(storeId, value) {
    SearchedStoreStoreActions.setSearchedStoreCollectionValue(this.props.deliveryGroupId, storeId, value);
  }

  renderSearchStores() {
    const { locationSearchField, locationSearchButton } = this.props.locationSearchForm;

    return (
      <SearchStores
        formContext={FormIdentifier.locationSearchForm(this.props.deliveryGroupId)}
        locationSearchField={locationSearchField}
        locationSearchButton={locationSearchButton}
        onSearchSubmit={this.handleSearchSubmit}
        onSearchValueChange={this.handleSearchValueChange}
        useGoogleMapsAPI={this.props.useGoogleMapsAPI} />
    )
  }

  renderStoreResultsFilter() {
    const {
      foundLocationsForText,
      showText,
      listViewText,
      mapViewText,
      noStoresAvailableText
    } = this.props.textDictionary;

    const { activeFilter, activeView, searchedText, stores, locationSearchForm: { locationSearchFilter } } = this.props;

    if (stores.length === 0) {
      const message = StringUtil.injectMap(noStoresAvailableText, { 1 : searchedText });
      return (
        <InlineNotification message={message} />
      )
    }

    return (
      <StoreResultsFilter
        locationSearchFilter={locationSearchFilter}
        activeFilter={activeFilter}
        activeView={activeView}
        resultCount={stores.length}
        searchedText={searchedText}
        foundLocationsForText={foundLocationsForText}
        listViewText={listViewText}
        mapViewText={mapViewText}
        onFilterChange={this.handleFilterChange}
        onViewFilterChange={this.handleViewFilterChange}/>
    );
  }

  renderStoreResults() {
    const {
      closestFalabellaStoreText,
      mapAndOpeningHoursText,
      selectText,
      newDriveThruText,
      weHaveADriveThruText,
      seeMoreText
    } = this.props.textDictionary;

    const { deliveryGroupId, activeView, activeFilter, stores, activeStoreId } = this.props;

    if (stores.length === 0) {
      return null;
    }

    if (activeView === LocationResultsFilters.MAP_VIEW) {
      return (
        <StoreResultsMap
          deliveryGroupId={deliveryGroupId}
          listOfStores={stores}
          storeId={activeStoreId}
          newDriveThruText={newDriveThruText}
          weHaveADriveThruText={weHaveADriveThruText}
          seeMoreText={seeMoreText}
          onSelectStoreButtonClick={this.handleSelectStoreButtonClick}
          onMapMarkerClick={this.handleMapMarkerClick}
          onCollectionTimeChange={this.handleCollectionTimeChange} />
      );
    }

    const listOfStores = activeView === LocationResultsFilters.LIST_VIEW &&
                                  activeFilter === LocationResultsFilters.All_LOCATIONS &&
                                  this.state.pageSize !== stores.length ? stores.slice(0, this.state.pageSize) : stores;

    return (
      <StoreResultsList
        listOfStores={listOfStores}
        closestFalabellaStoreText={closestFalabellaStoreText}
        mapAndOpeningHoursText={mapAndOpeningHoursText}
        newDriveThruText={newDriveThruText}
        weHaveADriveThruText={weHaveADriveThruText}
        seeMoreText={seeMoreText}
        onMapAndOpeningHoursLinkClick={this.handleMapAndOpeningHoursLinkClick}
        onSelectStoreButtonClick={this.handleSelectStoreButtonClick}
        onCollectionTimeChange={this.handleCollectionTimeChange} />
    );
  }

  renderAdditionalInfo() {
    const {
      onlyCollectionLocationsListedText,
      whereToGoWhatToBringText,
      tipsToHelpYouWhenText,
      collectingYourOrderText,
      viewMoreLocationsText
    } = this.props.textDictionary;

    const { activeView, activeFilter, stores } = this.props;

    if (stores.length === 0) {
      return null;
    }

    const viewMoreClickHandler = activeView === LocationResultsFilters.LIST_VIEW &&
                                  activeFilter === LocationResultsFilters.All_LOCATIONS &&
                                  this.state.pageSize !== stores.length ? this.handleViewMoreClick : null;

    return (
      <AdditionalInfo
        onlyCollectionLocationsListedText={onlyCollectionLocationsListedText}
        whereToGoWhatToBringText={whereToGoWhatToBringText}
        tipsToHelpYouWhenText={tipsToHelpYouWhenText}
        collectingYourOrderText={collectingYourOrderText}
        viewMoreLocationsText={viewMoreLocationsText}
        onCollectingYourOrderClick={this.handleCollectingYourOrderClick}
        showViewMoreLink={this.state.pageSize < this.props.stores.length}
        onViewMoreClick={viewMoreClickHandler} />
    );
  }

  render() {
    return (
      <Section className={ClassNameUtil.getComponentClassNames(this)}>
        {this.renderSearchStores()}
        {this.renderStoreResultsFilter()}
        {this.renderStoreResults()}
        {this.renderAdditionalInfo()}
      </Section>
    )
  }
}

SelectStoreScreen.propTypes = {
  deliveryGroupId: PropTypes.string.isRequired,
  textDictionary: PropTypes.object.isRequired,
  activeFilter: PropTypes.number.isRequired,
  activeStoreId: PropTypes.string,
  activeView: PropTypes.number.isRequired,
  searchedText: PropTypes.string,
  locationSearchForm: PropTypes.object,
  stores: PropTypes.array,
  endPoints: PropTypes.object,
  defaultPageSize: PropTypes.number,
  className: PropTypes.string,
  classNames: PropTypes.array
}

SelectStoreScreen.defaultProps = {
  textDictionary: {},
  activeFilter: 0,
  activeView: 0,
  searchedText: '',
  locationSearchForm: {},
  stores: [],
  defaultClassName: 'fbra_deliverAndCollect__screen fbra_deliverAndCollect__selectStoreScreen',
  className: '',
  classNames: []
}
