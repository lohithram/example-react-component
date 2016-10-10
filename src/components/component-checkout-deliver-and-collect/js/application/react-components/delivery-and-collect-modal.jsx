import React, {Component, PropTypes} from 'react';
import {ContextUtil, DebugUtil, Modal, ModalTemplates} from '../class-library';

import ModalActions  from '../actions/modal-actions';
import DeliveryModalStore  from '../stores/delivery-modal-store';
import DeliveryModalTypes from "../constants/delivery-modal-types";

/*************************************************************************
 *
 * DeliveryAndCollectModal
 * Specific to delivery and collect component
 *
 *************************************************************************/
export default class DeliverAndCollectModal extends Component {

    constructor(props) {

      super(props);
      this.bindHandlers();
      this.addStoreListeners();
      this.state = this.initialState();
      this.requestContext = ContextUtil.getUniqueContext();
    }

    initialState(){

      return DeliveryModalStore.state ? DeliveryModalStore.state :
                {
                  showModal: DeliveryModalStore.state.showModal,
                  modalId: DeliveryModalStore.state.modalId,
                  modalData: DeliveryModalStore.state.modalData
                };
    }

    /**
     * Event Handling
     */
    bindHandlers() {

      this.onModalClose = this.onModalClose.bind(this);
      this.onFirstOptionSelected = this.onFirstOptionSelected.bind(this);
      this.onSecondOptionSelected = this.onSecondOptionSelected.bind(this);
    }

    /**
     * addStoreListeners
     * Add all store listener
     */
    addStoreListeners(){
      this.DeliveryModalStoreListener =
          DeliveryModalStore.addChangeListener(this.handleStoreChange.bind(this));
    }

    /**
     * removeStoreListeners
     * Remove all store listeners
     */
    removeStoreListeners(){
      this.DeliveryModalStoreListener.dispose();
    }

    componentWilMount(){
      this.addStoreListeners();
    }

    componentWillUnmount(){
      this.removeStoreListeners();
    }

    /**
     * handleStoreChange
     * Called upon event of change in all stores
     */
    handleStoreChange(){

      let state = DeliveryModalStore.getState();
      this.setState(state);
    }

    /**
     * render
     *
     */
    render() {

      const {orText} = this.props.textDictionary;
      const modalTemplateId = this.getTemplateForModalId(this.state.modalId);
      const modalData = $.extend({}, this.state.modalData, {orText:orText});

      return (<Modal showModal={this.state.showModal}
                      modalData={modalData}
                      modalTemplateId={modalTemplateId}
                      onClose={this.onModalClose}
                      onFirstOptionSelected={this.onFirstOptionSelected}
                      onSecondOptionSelected={this.onSecondOptionSelected}/>);
    }

    /**
     * getTemplateForModalId
     * Returns the template to be used for the given modal id
     */
    getTemplateForModalId(modalId) {

      switch (modalId) {
        case DeliveryModalTypes.INCOMPATIBLE_CART:
          return ModalTemplates.FORM_BASED_MODAL;
        case DeliveryModalTypes.ITEMS_UNAVAILABLE:
        case DeliveryModalTypes.STOCK_NOT_AVAILABLE:
          return ModalTemplates.SIMPLE_ACTION_MODAL;
        default:
          return modalId;
      }
    }

    /**
     * onFirstOptionSelected
     * Call the associated handler and close the modal
     */
     onFirstOptionSelected(event, payload={}) {

       const modalData = this.state.modalData;
       if(modalData.onFirstOptionSelected){

          modalData.onFirstOptionSelected(payload);
       }else {

         this.callAppropriateFirstAction(payload);
       }
       this._closeModal(event);
    }

    /**
     * onSecondActionSelected
     * Call the associated handler and close the modal
     */
     onSecondOptionSelected(event, payload={}) {

       const modalData = this.state.modalData;
       if(modalData.onSecondOptionSelected){

          modalData.onSecondOptionSelected(payload);
       }else{

         this.callAppropriateSecondAction(payload);
       }
       this._closeModal(event);
    }

    /**
     * callAppropriateFirstAction
     */
    callAppropriateFirstAction(payload) {
      const { endPoints } = this.props;

      switch (this.state.modalId) {
        case DeliveryModalTypes.INCOMPATIBLE_CART:
          ModalActions.continueWithTheCompatibleItems(payload, endPoints, this.requestContext);
          break;
        case DeliveryModalTypes.ITEMS_UNAVAILABLE:
          ModalActions.continueWithAvailableItems(payload, endPoints, this.requestContext);
          break;
        case DeliveryModalTypes.STOCK_NOT_AVAILABLE:
          ModalActions.continueWithProposedQuantities(payload, endPoints, this.requestContext);
          break;
      }
    }

    /**
     * callAppropriateSecondAction
     */
    callAppropriateSecondAction(payload) {

      switch (this.state.modalId) {
        case DeliveryModalTypes.STOCK_NOT_AVAILABLE:
          ModalActions.cancelProposedQuantities();
          break;
      }
    }

    /**
     * onModalClose
     * Close the modal and no further action needed
     */
    onModalClose(event){

      const modalData = this.state.modalData;
      if(modalData.onClose){

        modalData.onClose();
      }
      this._closeModal(event);
    }

    _closeModal(event){

      event.preventDefault();
      ModalActions.closeModal(this.state.modalId);
    }
}

DeliverAndCollectModal.propTypes = {
  textDictionary: PropTypes.object.isRequired,
  endPoints: PropTypes.object.isRequired
};
