import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  Collapsible,
  Price,
  PropTypesUtil
} from '../../../class-library';
import ShippingMethod from './shipping-method';
import getSelectedShippingMethod from '../../../utils/get-selected-shipping-method';
import CustomDateTimeDelivery from '../custom-date-time-delivery/date-time-delivery-container';

export default class WhenToDeliver extends Component {

  _getActiveType() {
    const shippingMethods = this.props.shippingMethodsAndDeliverySlotExtras.map(
      x => x.shippingMethod
    );
    const selected = getSelectedShippingMethod(shippingMethods);
    return selected ? selected.type : null;
  }

  _getShippingMethodByType(type) {
    return this.props.shippingMethods.find(x => x.type === type);
  }

  _onSelectShippingMethod(activeType, newType) {
    // We must always have a selected value, so don't allow undefined
    if (typeof newType === 'undefined') return;

    // Nothing to do if unchanged
    if (newType === activeType) return;

    this.props.onSelectShippingMethod(newType);
  }

  _onRequestDeliverySlots(shippingMethodType, pageIndex) {
    this.props.onRequestDeliverySlots(shippingMethodType, pageIndex);
  }

  _onSelectTimeSlot(shippingMethodType, pageIndex, timeSlotId) {
    this.props.onSelectTimeSlot(shippingMethodType, pageIndex, timeSlotId);
  }

  _shippingMethodNeedsTimeSlotSelector({ type }) {
    return [2, 3].indexOf(type) > -1;
  }

  _getTimeSlotSelector(text, shippingMethodAndDeliverySlotExtras) {
    const {
      shippingMethod: sm,
      selectedTimeSlotId,
      selectedPageIndex,
      deliverySlotsIndex
    } = shippingMethodAndDeliverySlotExtras;

    if (!this._shippingMethodNeedsTimeSlotSelector(sm)) return null;

    return (
      <Collapsible.Body className={ClassNameUtil.getClassNames(['fbra_whenToDeliver__shippingMethodBody', 'fbra_test_whenToDeliver__shippingMethodBody'])}>
        <CustomDateTimeDelivery
          shippingMethodType={ sm.type }
          selectedTimeSlotId={ selectedTimeSlotId }
          initialPageIndex={ selectedPageIndex }
          maximumNumberOfWeeks={ this.props.maximumNumberOfWeeks }
          deliverySlotsIndex={ deliverySlotsIndex }
          deliverySlotRanges={ sm.deliverySlotRanges }
          onRequestDeliverySlots={ this._onRequestDeliverySlots.bind(this, sm.type) }
          onSelectTimeSlot={ this._onSelectTimeSlot.bind(this, sm.type) }

          textDictionary={{
            goToNextPageText: text.goToNextPageText,
            goToPreviousPageText: text.goToPreviousPageText,
            selectAllDayText: text.selectAllDayText,
            creditCardsAcceptedText: text.creditCardsAcceptedText,
            payOnDeliverySelectedText: text.payOnDeliverySelectedText,
            selectCustomSlotText: text.selectCustomSlotText
          }}
        />
      </Collapsible.Body>
    );
  }

  /**
  * Render a shipping method as a Collapsible.Item
  */
  _renderShippingMethod(shippingMethodAndDeliverySlotExtras) {
    const text = this.props.textDictionary;
    const sm = shippingMethodAndDeliverySlotExtras.shippingMethod;

    return (
      <Collapsible.Item
        key={ sm.type }
        identifier={ sm.type }
        className={ClassNameUtil.getClassNames(['fbra_whenToDeliver__shippingMethod', 'fbra_test_whenToDeliver__shippingMethod'])}
        >
        <Collapsible.Header className={ClassNameUtil.getClassNames(['fbra_whenToDeliver__shippingMethodHeader', 'fbra_test_whenToDeliver__shippingMethodHeader'])}>
          <ShippingMethod
            type={ sm.type }
            label={ sm.label }
            deliveryInfoDate={ sm.deliveryInfoDate }
            deliveryInfoCost={ sm.deliveryInfoCost }
          />
        </Collapsible.Header>

        { this._getTimeSlotSelector(text, shippingMethodAndDeliverySlotExtras) }
      </Collapsible.Item>
    );
  }

  render() {
    const { shippingMethodsAndDeliverySlotExtras } = this.props;
    const activeType = this._getActiveType();

    return (
      <Collapsible
        activeItems={ [activeType] } // Controlled mode
        allowMultiple={ false } // Accordion mode
        onChange={ ([newType]) => this._onSelectShippingMethod(activeType, newType) }
        className={ ClassNameUtil.getComponentClassNames(this) }
      >
        { shippingMethodsAndDeliverySlotExtras.map(this._renderShippingMethod.bind(this)) }
      </Collapsible>
    );
  }
}

/**
 * NB PropTypes not propTypes - useful for upstream validation
 */
WhenToDeliver.PropTypes = {
  textDictionary: {
    goToNextPageText: PropTypes.string.isRequired,
    goToPreviousPageText: PropTypes.string.isRequired,
    selectAllDayText: PropTypes.string.isRequired,
    creditCardsAcceptedText: PropTypes.string.isRequired,
    payOnDeliverySelectedText: PropTypes.string.isRequired,
    selectCustomSlotText: PropTypes.string.isRequired
  }
};

/**
 * NB propTypes not PropTypes - standard React propTypes
 */
WhenToDeliver.propTypes = {
  shippingMethodsAndDeliverySlotExtras: PropTypes.arrayOf(PropTypes.shape({
    shippingMethod: PropTypes.shape({
      type: PropTypes.number.isRequired,
      selected: PropTypes.bool,
      label: PropTypes.string.isRequired,
      deliveryInfoDate: PropTypes.string,
      deliveryInfoCost: Price.PropTypes.priceDataShape.isRequired,
      deliverySlotPageIndex: PropTypes.number,
      deliverySlots: PropTypes.array
    }).isRequired,
    selectedTimeSlotId: PropTypes.string,
    selectedPageIndex: PropTypes.number,
    deliverySlotsIndex: PropTypes.object
  })).isRequired,

  maximumNumberOfWeeks: PropTypes.number.isRequired,

  textDictionary: PropTypes.shape(WhenToDeliver.PropTypes.textDictionary),

  onSelectShippingMethod: PropTypes.func,
  onSelectTimeSlot: PropTypes.func,
  onRequestDeliverySlots: PropTypes.func
};

WhenToDeliver.defaultProps = {
  onSelectShippingMethod: () => {},
  onSelectTimeSlot: () => {},
  onRequestDeliverySlots: () => {},
  defaultClassName: 'fbra_whenToDeliver',
  className: '',
  classNames: []
};
