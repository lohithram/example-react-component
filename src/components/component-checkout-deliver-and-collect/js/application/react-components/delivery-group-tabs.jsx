import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  StringUtil,
  Message,
  MessageTypes,
  Tab,
  Anchor,
  TabSet,
  Text,
  Image,
  Heading,
  InlineNotification,
  DeliveryGroupTabTypes
} from '../class-library';

export default class DeliveryGroupTabs extends Component {
  constructor(props){
    super(props);
    this._bindHandlers();
  }

  _bindHandlers() {
    this._handleTabClick = this._handleTabClick.bind(this);
    this._getTabAvailability = this._getTabAvailability.bind(this);
    this._getTabConfig = this._getTabConfig.bind(this);
  }

  _handleTabClick(tab) {
    if (tab !== this.props.selectedTab) {
      this.props.onTabChange(this.props.deliveryGroupId, tab);
    }
  }

  _getTabAvailability(tab) {
    switch(tab) {
      case DeliveryGroupTabTypes.DELIVER:
      return this.props.deliveryAvailable;
      case DeliveryGroupTabTypes.COLLECT:
      return this.props.collectAvailable;
    }
  }

  _getTabConfig(tab) {
    var enabled = this.props.enabled && this._getTabAvailability(tab);
    return {
      enabled,
      active: (this.props.selectedTab === tab),
      onClick: enabled ? () => this._handleTabClick(tab) : null
    }
  }

  renderTabText(tab) {
    const { notAvailableWhyText } = this.props.textDictionary;

    /*
    * if the component is enabled (not GUEST_WITH_NO_LOCATION) but a tab is not available,
    * we render the availability CTA
    */
    if (this.props.enabled && !this._getTabAvailability(tab)) {
      return (
        <InlineNotification message={notAvailableWhyText} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__notification', 'fbra_test_deliveryGroupTabs__notification'])}/>
      );
    }

    var price = tab === DeliveryGroupTabTypes.DELIVER ? this.props.deliveryPrice : this.props.collectPrice;
    return (
      <Text className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__text', 'fbra_test_deliveryGroupTabs__text'])}>{ price }</Text>
    );
  }

  /**
   * render
   * Render the component
   */
  render(){
    const {
      deliverToAddressText,
      collectYourOrderText
    } = this.props.textDictionary;

    return (
      <TabSet className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs fbra_test_deliveryGroupTabs'])}>
        <Tab {...this._getTabConfig(DeliveryGroupTabTypes.DELIVER)} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__tab', 'fbra_deliveryGroupTabs__tab--delivery', 'fbra_test_deliveryGroupTabs__tab', 'fbra_test_deliveryGroupTabs__tab--delivery'])}>
          <Image className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__image', 'fbra_test_deliveryGroupTabs__image'])} />
          <Heading level={3} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__heading', 'fbra_test_deliveryGroupTabs__heading'])}>{deliverToAddressText}</Heading>
          {this.renderTabText(DeliveryGroupTabTypes.DELIVER)}
        </Tab>
        <Tab {...this._getTabConfig(DeliveryGroupTabTypes.COLLECT)} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__tab', 'fbra_deliveryGroupTabs__tab--collect', 'fbra_test_deliveryGroupTabs__tab', 'fbra_test_deliveryGroupTabs__tab--collect'])}>
          <Image className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__image', 'fbra_test_deliveryGroupTabs__image'])} />
          <Heading level={3} className={ClassNameUtil.getClassNames(['fbra_deliveryGroupTabs__heading', 'fbra_test_deliveryGroupTabs__heading'])}>{collectYourOrderText}</Heading>
          {this.renderTabText(DeliveryGroupTabTypes.COLLECT)}
        </Tab>
      </TabSet>
    )
  }
}

DeliveryGroupTabs.PropTypes = {
  deliveryGroupId: PropTypes.string,
  textDictionary: PropTypes.object.isRequired,
  selectedTab: PropTypes.number,
  enabled: PropTypes.bool,
  deliveryAvailable: PropTypes.bool,
  collectAvailable: PropTypes.bool,
  deliveryPrice: PropTypes.string,
  collectPrice: PropTypes.string,
  endPoints: PropTypes.object,
  onTabChange: PropTypes.func
};

DeliveryGroupTabs.defaultProps = {
  selectedTab: DeliveryGroupTabTypes.DELIVER,
  enabled: true,
  deliveryAvailable: true,
  collectAvailable: true,
  onTabChange: () => {}
};
