import React, { Component, PropTypes } from 'react';
import { ClassNameUtil, Price, RadioOption } from '../../../class-library'

export default class DateTimeDeliverySlot extends Component{
  _onChangeHandler(){
    this.props.onTimeChangeHandler(this.props.timeSlotId);
  }

  render(){
    const classNames = ClassNameUtil.getComponentClassNames(this);
    const priceData = this.props.shippingCost;

    return(
      <div className={classNames}>
        <RadioOption
          className={ClassNameUtil.getClassNames(['fbra_dateTimeDeliverySlot__slot', 'fbra_test_dateTimeDeliverySlot__slot'])}
          name={this.props.timeSlotId}
          checked={this.props.checked}
          onClick={this._onChangeHandler.bind(this)}
        >
          <span>{ this.props.timeRange }</span>
          <Price { ...this.props.shippingCost } />
        </RadioOption>
      </div>
    );
  }
}

DateTimeDeliverySlot.defaultProps = {
  defaultClassName: 'fbra_dateTimeDeliverySlot',
  className: '',
  classNames: []
}

DateTimeDeliverySlot.propTypes = {
  shippingCost: Price.PropTypes.priceDataShape.isRequired,
  timeSlotId: PropTypes.string.isRequired,
  timeRange: PropTypes.string,
  checked: PropTypes.bool
};
