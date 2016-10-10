import React, { Component, PropTypes } from 'react';
import {
  DebugUtil,
  ClassNameUtil,
  RegionAndComunaActionTypes,
  ContextUtil,
  ContextualErrorMessages,
  ApplicationDispatcher,
  DeliveryGroupStore
} from '../class-library';
import DeliveryGroupsContainer from './delivery-groups-container';
import DeliveryAndCollectModal from "./delivery-and-collect-modal";
import ComponentActions from '../actions/deliver-and-collect-component-actions';

export default class AppContainer extends Component{

  constructor(props){
    super(props);
    this._bindHandlers();
    this.contextIdentifier = ContextUtil.getUniqueContext('deliver-and-collect-app-container');
    this.state = this._buildStateFromStores();
  }

  /**
   * componentDidMount
   * Called upon component mount
   */
  componentDidMount(){
    this.mounted = true;
    this._addStoreListeners();
    this._addActionInterests();
  }

  /**
   * componentWillUnmount
   * Called just before component unmounts
   */
  componentWillUnmount(){
    this.mounted = false;
    this._removeStoreListeners();
    this._removeActionInterests();
  }

  /**
   * bindHandlers
   * Bind all handlers
   */
  _bindHandlers(){
    this._handleStoreChange = this._handleStoreChange.bind(this);
  }

  /**
   * addStoreListeners
   * Add all store listeners
   */
  _addStoreListeners(){
    this.deliveryGroupStoreListener = DeliveryGroupStore.addChangeListener(this._handleStoreChange);
  }

  /**
   * removeStoreListeners
   * Remove all store listeners
   */
  _removeStoreListeners(){
    if(this.deliveryGroupStoreListener)
      this.deliveryGroupStoreListener.dispose();
  }

  _addActionInterests(){
    this.dispatchToken = ApplicationDispatcher.register((payload) => {
      switch(payload.actionType){
        case RegionAndComunaActionTypes.RECEIVE_REGION_AND_COMUNA_CHANGE:
          ComponentActions.getServerState(this.props.endPoints, this.contextIdentifier);
          break;
      }
    });
  }

  _removeActionInterests(){
    if(this.dispatchToken)
      ApplicationDispatcher.unregister(this.dispatchToken);
  }

  /**
   * buildStateFromStores
   * Builds the component container state from all the stores
   */
  _buildStateFromStores(){
    const deliveryGroups = DeliveryGroupStore.getDeliveryGroups();
    return {
      deliveryGroups: deliveryGroups
    };
  }

  /**
   * handleStoreChange
   * Called upon event of change in all stores
   */
  _handleStoreChange(){
    if(this.mounted){
      this.setState(this._buildStateFromStores());
    }
  }

  /************************************
   * Render
   ************************************/

  /**
   * _getDeliveryGroupsContent
   * Return the delivery groups content
   */
  _getDeliveryGroupsContent() {
    const { textDictionary, endPoints, maximumNumberOfWeeks } = this.props;
    return(
      <DeliveryGroupsContainer
        endPoints={endPoints}
        textDictionary={textDictionary}
        maximumNumberOfWeeks={maximumNumberOfWeeks}
      />
    );
  }

  /**
   * render
   * Render component
   */
  render() {
    return(
      <div className={ClassNameUtil.getClassNames(['fbra_appContainer', 'fbra_test_appContainer'])}>
        <ContextualErrorMessages for={this.contextIdentifier} />
        {this._getDeliveryGroupsContent()}
        <DeliveryAndCollectModal {...this.props}/>
      </div>
    );
  }
}

AppContainer.proptypes = {
  textDictionary: PropTypes.object.isRequired,
  endPoints: PropTypes.object.isRequired
}
