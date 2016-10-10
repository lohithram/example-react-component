
/************************************************************************
 * ClickAndCollectTabContentContainer
 * The main controller view for the content within the click and collect tab
 * of the deliver or collect item
 ************************************/

// React
import React, { Component, PropTypes } from 'react';
import {
  SearchedStoreStore,
} from '../../stores/stores';
import DeliveryGroupScreenTypes from '../../constants/delivery-group-screen-types';
import StoreSelectedScreen from './store-selected-screen';
import SelectStoreScreen from './select-store-screen';
import DeliveryGroupUtil from '../../utils/delivery-group';
import {
  DebugUtil,
  ClassNameUtil,
  InlineNotification,
  SelectedStoreStore,
  WhoWillCollectStore,
  DeliveryGroupStore,
  ObjectUtil
} from '../../class-library';

export default class ClickAndCollectTabContentContainer extends Component {

  constructor(options) {
    super(options);
    this._bindHandlers();
    this.state = this._buildStateFromStores();
  }

  _bindHandlers(){
    this._handleStoreChange = this._handleStoreChange.bind(this);
  }

  /**
   * componentDidMount
   * Called upon component mount
   */
  componentDidMount() {
    this.mounted = true;
    this._addStoreListeners();
  }

  /**
   * componentWillUnmount
   * Called just before component unmounts
   */
  componentWillUnmount() {
    this.mounted = false;
    this._removeStoreListeners();
  }

  /************************************
   * Stores
   ************************************/

  /**
   * buildStateFromStores
   * Builds the component container state from all the stores
   */
  _buildStateFromStores() {
    const { deliveryGroupId } = this.props;
    const searchedStores = SearchedStoreStore.getFilteredStoresForDeliveryGroup(deliveryGroupId);
    const deliveryGroup = DeliveryGroupStore.getDeliveryGroup(deliveryGroupId);
    const locationSearchForm = DeliveryGroupStore.getLocationSearchForm();
    const selectedStore = SelectedStoreStore.getSelectedStore(deliveryGroupId);
    const activeScreen = DeliveryGroupUtil.getActiveClickAndCollectScreenForDeliveryGroup(selectedStore, searchedStores.stores);
    const whoWillCollect = WhoWillCollectStore.getWhoWillCollect(deliveryGroupId);
    const notifications = DeliveryGroupStore.getDeliveryGroupClickAndCollectNotifications(deliveryGroupId);

    return {
      ...searchedStores,
      deliveryGroup,
      locationSearchForm,
      selectedStore,
      activeScreen,
      whoWillCollect,
      notifications
    };
  }

  /**
   * addStoreListeners
   * Add all store listeners
   */
  _addStoreListeners() {
    DebugUtil.log("Adding store listeners");
    this.deliveryGroupStoreListener = DeliveryGroupStore.addChangeListener(this._handleStoreChange);
    this.selectedStoreStoreListener = SelectedStoreStore.addChangeListener(this._handleStoreChange);
    this.searchedStoreStoreListener = SearchedStoreStore.addChangeListener(this._handleStoreChange);
    this.whoWillCollectStoreListener = WhoWillCollectStore.addChangeListener(this._handleStoreChange);
  }

  /**
   * removeStoreListeners
   * Remove all store listeners
   */
  _removeStoreListeners() {
    DebugUtil.log("Removing store listeners");

    if(this.deliveryGroupStoreListener)
      this.deliveryGroupStoreListener.dispose();

    if(this.selectedStoreStoreListener)
      this.selectedStoreStoreListener.dispose();

    if(this.searchedStoreStoreListener)
      this.searchedStoreStoreListener.dispose();

    if(this.whoWillCollectStoreListener)
      this.whoWillCollectStoreListener.dispose();
  }

  /**
   * handleStoreChange
   * Called upon event of change in all stores
   */
  _handleStoreChange() {
    if(this.mounted)
      this.setState(this._buildStateFromStores());
  }

  /************************************
   * Render
   ************************************/

  /**
   * getSelectStoreScreenContent
   * Return the select store scren content
   */
  _getSelectStoreScreenContent() {
    const containerClassNames = ClassNameUtil.getClassNames([
      'fbra_clickAndCollectTabContentContainer__selectStoreScreen',
      'fbra_test_clickAndCollectTabContentContainer_selectStoreScreen'
    ]);
    const { activeFilter, activeView, activeStoreId, searchedText, locationSearchForm, stores } = this.state;
    let sText = searchedText ? searchedText : ObjectUtil.getValueAt(this.state, 'locationSearchForm.locationSearchField.savedValue');
    return (
      <div className={containerClassNames}>
        <SelectStoreScreen
          activeFilter={activeFilter}
          activeView={activeView}
          activeStoreId={activeStoreId}
          searchedText={sText}
          locationSearchForm={locationSearchForm}
          stores={stores}
          {...this.props} />
      </div>
    );
  }

  /**
   * getStoreSelectedScreenContent
   * Return the store selected screen content
   */
  _getStoreSelectedScreenContent() {
    const containerClassNames = ClassNameUtil.getClassNames([
      'fbra_clickAndCollectTabContentContainer__storeSelectedScreen',
      'fbra_test_clickAndCollectTabContentContainer_storeSelectedScreen'
    ]);
    const { deliveryGroupId, textDictionary, endPoints } = this.props;
    const { selectedStore, whoWillCollect } = this.state;
    return (
      <div className={containerClassNames}>
        <StoreSelectedScreen
          store={selectedStore}
          whoWillCollect={whoWillCollect}
          deliveryGroupId={deliveryGroupId}
          textDictionary={textDictionary}
          endPoints={endPoints} />
      </div>
    );
  }

  /**
   * getContent
   * Return the component
   */
  _getActiveScreenContent() {
    if (DeliveryGroupUtil.getShouldOverrideActiveScreenForNotification(this.state.notifications)) {
      return null;
    }

    switch (this.state.activeScreen) {
      case DeliveryGroupScreenTypes.SELECT_STORE:
        return this.props.allowStoreSelection ? this._getSelectStoreScreenContent() : null;
        break;
      case DeliveryGroupScreenTypes.STORE_SELECTED:
        return this._getStoreSelectedScreenContent();
        break;
    }
    return null;
  }

  /**
   * _getNotificationsContent
   * Return the delivery group click and collect notifications content
   */
  _getNotificationsContent() {
    const { deliveryGroupId } = this.props;
    if (this.state.notifications) {
      return this.state.notifications.map((notification) => {
        const { message } = notification;
        return (
          <InlineNotification message={message}
                              key={`click-and-collect-notification-${deliveryGroupId}`}
                              className={ClassNameUtil.getClassNames('fbra_clickAndCollectTabContentContainerNotification')}
                              />
        );
      })
    }
    return null;
  }

  /**
   * render
   * Render component
   */
  render() {
    const activeScreenContent = this._getActiveScreenContent();
    const notificationsContent = this._getNotificationsContent();

    if (notificationsContent !== null || activeScreenContent !== null) {
      const containerClassNames = ClassNameUtil.getClassNames([
        'fbra_clickAndCollectTabContentContainer',
        'fbra_test_clickAndCollectTabContentContainer'
      ]);

      return (
        <div className={containerClassNames}>
          {notificationsContent}
          {activeScreenContent}
        </div>
      );
    }

    return null;
  }
}

ClickAndCollectTabContentContainer.propTypes = {
  textDictionary: PropTypes.object.isRequired,
  deliveryGroupId: PropTypes.string.isRequired,
  defaultPageSize: PropTypes.number.isRequired,
  useGoogleMapsAPI: PropTypes.bool.isRequired,
  endPoints: PropTypes.object.isRequired,
  allowStoreSelection: PropTypes.bool
}

ClickAndCollectTabContentContainer.defaultProps = {
  allowStoreSelection: true
}
