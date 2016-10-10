import React, { PropTypes, Component } from 'react';

import { ClassNameUtil, StringUtil, ModalTemplates, Image, ContextUtil, Text, InlineNotification, Paragraph,
       DebugUtil,
       SelectedStoreStore,
       DeliveryGroupTabTypes,
       DeliveryGroupStore,
       DeliveryGroupStoreActions,
       ShippingMethodsStore,
       DeliverToAddressStatusStore,
       DeliverToAddressStatusTypes } from '../class-library';
import DeliveryGroupTabs from './delivery-group-tabs';
import DeliverToAddressTabContentContainer from './deliver-to-address-tab-content/deliver-to-address-tab-content-container';
import ClickAndCollectTabContentContainer from './click-and-collect-tab-content/click-and-collect-tab-content-container';
import ClickAndCollectActions from '../actions/click-and-collect-actions';
import HomeDeliveryActions from '../actions/home-delivery-actions';
import DeliveryGroupHeader from "./delivery-group-header"
import DeliveryGroupActions from '../actions/delivery-group-actions';
import ModalActions from '../actions/modal-actions';
import DeliveryGroupUtil from '../utils/delivery-group'
import {
  DeliveryGroupsNotificationsStore
} from '../stores/stores';
export default class DeliveryGroupsContainer extends Component {

  constructor(props){
    super(props);
    this.state = this._buildStateFromStores();
    this._bindHandlers();
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
    this._handleTabChange = this._handleTabChange.bind(this);
    this._deleteDeliveryGroupHeaderHandler = this._deleteDeliveryGroupHeaderHandler.bind(this);
  }

  _addStoreListeners(){
    this.deliveryGroupStoreListener = DeliveryGroupStore.addChangeListener(this._handleStoreChange);
    this.deliverToAddressStatusStoreListener = DeliverToAddressStatusStore.addChangeListener(this._handleStoreChange);
    this.deliveryGroupsNotificationsStoreListener = DeliveryGroupsNotificationsStore.addChangeListener(this._handleStoreChange);
    this.selectedStoreStoreListener = SelectedStoreStore.addChangeListener(this._handleStoreChange);
  }

  _removeStoreListeners(){
    if (this.deliveryGroupStoreListener) this.deliveryGroupStoreListener.dispose();
    if (this.deliverToAddressStatusStoreListener) this.deliverToAddressStatusStoreListener.dispose();
    if (this.deliveryGroupsNotificationsStoreListener) this.deliveryGroupsNotificationsStoreListener.dispose();
    if (this.selectedStoreStoreListener) this.selectedStoreStoreListener.dispose();
  }

  _buildStateFromStores(){
    return {
      deliveryGroups: DeliveryGroupStore.getDeliveryGroups(),
      deliverToAddressStatus: DeliverToAddressStatusStore.getStatus(),
      ...DeliveryGroupStore.getDeliveryGroupsConfig()
    }
  }

  _handleStoreChange(){
    if(this.mounted)
      this.setState(this._buildStateFromStores());
  }

  _handleTabChange(deliveryGroupId, selectedTab) {
    DeliveryGroupStoreActions.setSelectedTab(deliveryGroupId, selectedTab);
    switch (selectedTab) {
      case DeliveryGroupTabTypes.DELIVER:
      this._setSelectedDeliveryTime(deliveryGroupId);
      break;
      case DeliveryGroupTabTypes.COLLECT:
      this._setSelectedStore(deliveryGroupId);
      break;
    }
  }

  _setSelectedDeliveryTime(deliveryGroupId)  {
    let selectedShippingMethod = ShippingMethodsStore.getSelectedShippingMethodAndDeliverySlotExtras(deliveryGroupId);
    if (selectedShippingMethod) {
      HomeDeliveryActions.selectTimeSlot(deliveryGroupId, selectedShippingMethod.type, selectedShippingMethod.selectedPageIndex, selectedShippingMethod.selectedTimeSlotId, this.props.endPoints);
    }
  }

  _setSelectedStore(deliveryGroupId) {
    let selectedStore = SelectedStoreStore.getSelectedStore(deliveryGroupId);
    if (selectedStore) {
      ClickAndCollectActions.setSelectedStore(deliveryGroupId, selectedStore.storeId, this.props.endPoints);
    }
  }

  _deleteDeliveryGroupHeaderHandler(deliveryGroupId, event){
    event.preventDefault();
    const textDictionary = this.props.textDictionary;
    DebugUtil.log("Prompting User to confirm removing delivery group", deliveryGroupId);
    ModalActions.showModal(ModalTemplates.SIMPLE_ACTION_MODAL, {
        headerContent: textDictionary.removeDeliveryGroupConfirmationTitleText,
        content: textDictionary.removeDeliveryGroupConfirmationText,
        yesText: textDictionary.removeDeliveryGroupConfirmationYesText,
        noText: textDictionary.removeDeliveryGroupConfirmationNoText,
        onFirstOptionSelected: this._onUserDeliveryGroupRemoveConfirm.bind(this, deliveryGroupId)
      });
  }

  _onUserDeliveryGroupRemoveConfirm(deliveryGroupId){
    DebugUtil.log("User confirmed to remove delivery group - ", deliveryGroupId);
    DeliveryGroupActions.removeDeliveryGroup(this.props.endPoints.removeDeliveryGroup, deliveryGroupId, ContextUtil.getRandomContextId());
  }

  _getSplitOrderHeading(index, total){
    return  StringUtil.injectMap(this.props.textDictionary.deliveryOfText, { 1 : (index + 1), 2 : total });
  }

  _getItemImages(items){
    let images = null;

    if(items){
      images = items.map((item, i) => {
        return (
          <div className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__itemImageWrapper', 'fbra_test_deliveryGroupsContainer__itemImageWrapper'])}>
            <Image key={i} className={ ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__itemImage', 'fbra_test_deliveryGroupsContainer__itemImage', 'fbra_test_productImage'])} src={item.image.file}></Image>
            <div className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__productDetails'])}>
              <span className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__itemName', 'fbra_test_deliveryGroupsContainer__itemName'])}>{item.brandName}</span>
              <span className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__itemDetails', 'fbra_test_deliveryGroupsContainer__itemDetails'])}>{item.name}</span>
              <span className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__itemSize', 'fbra_test_deliveryGroupsContainer__itemSize'])}>{item.size}</span>
            </div>
          </div>
        )
      })
    }

    return images;

  }

  _getDeliveryGroupHeader(deliveryGroup, total, index){
    if(total && total > 1){
      let _heading = this._getSplitOrderHeading(index, total) ;
      let _items = this._getItemImages(deliveryGroup.items);

      return (
        <DeliveryGroupHeader removeText={this.props.textDictionary.removeText}
          deleteLinkHandler={this._deleteDeliveryGroupHeaderHandler}
          deliveryGroupId={deliveryGroup.deliveryGroupId}
          key={index} heading={_heading}>
          {_items}
        </DeliveryGroupHeader>
      );
    }else{
      return null;
    }
  }

  _getTabsContent(deliveryGroup){
    const { endPoints, textDictionary } = this.props;
    const { deliveryAvailable, collectAvailable } = DeliveryGroupUtil.getDeliveryGroupTabAvailability(deliveryGroup);
    return(
      <DeliveryGroupTabs
        deliveryGroupId={deliveryGroup.deliveryGroupId}
        textDictionary={textDictionary}
        selectedTab={deliveryGroup.selectedTab}
        deliveryAvailable={deliveryAvailable}
        collectAvailable={collectAvailable}
        deliveryPrice={this.state.deliveryPrice}
        collectPrice={this.state.collectionPrice}
        endPoints={endPoints}
        onTabChange={this._handleTabChange} />
    );
  }

  _getDeliveryGroupsContent(){
    const { textDictionary } = this.props;

    let total = this.state.deliveryGroups.length;
    let header = null;
    let encounteredMasterHomeDelivery = false;
    // Return only disabled tabs if the status is DeliverToAddressStatusTypes.GUEST_WITH_NO_LOCATION
    if (this.state.deliverToAddressStatus === DeliverToAddressStatusTypes.GUEST_WITH_NO_LOCATION) {
      return (
        <div className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__deliveryGroupsContent', 'fbra_test_deliveryGroupsContainer__deliveryGroupsContent'])}>
          <DeliveryGroupTabs
            textDictionary={textDictionary}
            enabled={false}
            deliveryPrice={this.state.deliveryPrice}
            collectPrice={this.state.collectionPrice} />
          <Paragraph className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__guestNoLocationMessage', 'fbra_test_deliveryGroupsContainer__guestNoLocationMessage', 'fbra_test_guestNoLocation__message'])}>
            {textDictionary.pleaseChooseDeliveryOrLocationText}
          </Paragraph>
        </div>
      );
    }

    // so we track and enable/disable store selection on click and collect
    const alreadySelectedStoreDeliveryGroupIds = SelectedStoreStore.getDeliveryGroupIdsForWhichStoreHasBeenSelected();
    let encounteredClickAndCollectDeliveryGroupIds = [];
    let masterDeliveryGroupId;

    return this.state.deliveryGroups.map((deliveryGroup, index) => {
      switch (deliveryGroup.selectedTab) {
        case DeliveryGroupTabTypes.DELIVER:
          let isMaster = false;
          if(!encounteredMasterHomeDelivery){
            encounteredMasterHomeDelivery = isMaster = true;
            masterDeliveryGroupId = deliveryGroup.deliveryGroupId;
          }
          header =  this._getDeliveryGroupHeader(deliveryGroup, total, index );
          return this._getHomeDeliveryContent(deliveryGroup, isMaster, header, masterDeliveryGroupId);
          break;

        case DeliveryGroupTabTypes.COLLECT:
          header =  this._getDeliveryGroupHeader(deliveryGroup, total, index );
          let allowStoreSelection = true;
          // we need to force the user to complete any previous 'click and collect' store selections before enabling store selection for the current delivery, unless its the first one
          if(encounteredClickAndCollectDeliveryGroupIds.length > 0){
            // 2nd or later 'click and collect' group, check if the previous one already has a selected store
            const previousClickAndCollectGroupId = encounteredClickAndCollectDeliveryGroupIds[encounteredClickAndCollectDeliveryGroupIds.length-1];
            allowStoreSelection = alreadySelectedStoreDeliveryGroupIds.indexOf(previousClickAndCollectGroupId) >= 0;
          }
          encounteredClickAndCollectDeliveryGroupIds.push(deliveryGroup.deliveryGroupId);
          return this._getClickAndCollectContent(deliveryGroup, allowStoreSelection, header);
          break;

        default:
          DebugUtil.log(`Attempted to render delivery group ${deliveryGroup.deliveryGroupId} which does not have correct a selected tab`);
      }
      return null;
    });
  }

  _getHomeDeliveryContent(deliveryGroup, isMaster, header, masterDeliveryGroupId){
    const tabs = this._getTabsContent(deliveryGroup);
    const key = `home-delivery-${deliveryGroup.deliveryGroupId}`;
    return(
      <div key={key} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__deliverToAddressTabContent', 'fbra_test_deliveryGroupsContainer__deliverToAddressTabContent', `fbra_test_homeDeliveryTabContent--${deliveryGroup.deliveryGroupId}`])}>
        {header}
        {tabs}
        <DeliverToAddressTabContentContainer
          deliveryGroupId={deliveryGroup.deliveryGroupId}
          isMaster={isMaster}
          masterDeliveryGroupId={masterDeliveryGroupId}
          maximumNumberOfWeeks={this.props.maximumNumberOfWeeks}
          textDictionary={this.props.textDictionary}
          endPoints={this.props.endPoints} />
      </div>
    );
  }


  _getClickAndCollectContent(deliveryGroup, allowStoreSelection, header){
    const tabs = this._getTabsContent(deliveryGroup);
    const key = `click-and-collect-${deliveryGroup.deliveryGroupId}`;
    return(
      <div key={key} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__clickAndCollectTabContent', 'fbra_test_deliveryGroupsContainer__clickAndCollectTabContent', `fbra_test_clickAndCollectTabContent--${deliveryGroup.deliveryGroupId}`])}>
        {header}
        {tabs}
        <ClickAndCollectTabContentContainer
          deliveryGroupId={deliveryGroup.deliveryGroupId}
          defaultPageSize={this.state.defaultPageSize}
          useGoogleMapsAPI={this.state.useGoogleMapsAPI}
          textDictionary={this.props.textDictionary}
          endPoints={this.props.endPoints}
          allowStoreSelection={allowStoreSelection} />
      </div>
    )
  }

  /**
   * _getDeliveryGroupsNotificationsContent
   * Return the notifications for all delivery groups combined
   */
  _getDeliveryGroupsNotificationsContent() {
    const notifications = DeliveryGroupsNotificationsStore.getNotifications();
    if (notifications) {
      return notifications.map((notification, index) => {

        const { message } = notification;
        return (<InlineNotification message={message} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer__notification', 'fbra_test_deliveryGroupsContainer__notification'])}/>);
      })
    }
    return null;
  }

  render(){
    const deliveryGroups = this._getDeliveryGroupsContent();
    const deliveryGroupsNotifications = this._getDeliveryGroupsNotificationsContent();
    return(
      <div className={ClassNameUtil.getClassNames(['fbra_deliveryGroupsContainer', 'fbra_test_deliveryGroupsContainer'])}>
        {deliveryGroupsNotifications}
        {deliveryGroups}
      </div>
    );
  }
}

DeliveryGroupsContainer.propTypes = {
  endPoints: PropTypes.object.isRequired,
  textDictionary: PropTypes.object.isRequired,
  maximumNumberOfWeeks: PropTypes.number.isRequired
}
