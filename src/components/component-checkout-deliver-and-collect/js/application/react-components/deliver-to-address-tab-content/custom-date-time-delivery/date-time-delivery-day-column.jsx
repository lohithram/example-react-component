import React, { Component, PropTypes } from 'react';
import { Checkbox, ClassNameUtil, DebugUtil, Label, Price, Text, DateUtil } from '../../../class-library';
import DateTimeDeliverySlot from './date-time-delivery-slot.jsx';

const emptyClassName = ClassNameUtil.getClassNames(["fbra_dateTimeDeliveryColumn__emptyTimeSlot", "fbra_test_dateTimeDeliveryColumn__emptyTimeSlot"]);

export default class DateTimeDeliveryDayColumn extends Component{
  constructor(props) {
    super(props);
    this._onTimeChangeHandler = this._onTimeChangeHandler.bind(this);
  }

  _onTimeChangeHandler(newTimeSlotId){
    DebugUtil.log("Custom Date Time-onTimeChangeHandler:", "with slot:", newTimeSlotId);
    this.props.onTimeChangeHandler(newTimeSlotId);
  }

  _isSelected({ timeSlotId }){
    return this.props.selectedDateTime === timeSlotId;
  }

  _getAllDaySlotContent(slots){
    let allDaySlot = <div className={emptyClassName}></div>;

    if(slots.allDayTimeSlot && slots.allDayTimeSlot.timeSlotId) {
      let selected = this._isSelected(slots.allDayTimeSlot);
      allDaySlot = <DateTimeDeliverySlot
        key={this.props.key}
        {...slots.allDayTimeSlot}
        checked={selected}
        onTimeChangeHandler={this._onTimeChangeHandler}>
      </DateTimeDeliverySlot>
    }

    return allDaySlot;
  }

  _getCustomSlotsContent(slots){
    return (slots && slots.length > 0)
    ?
    slots.map((slot, i) => {
      if(slot && slot.timeSlotId){
        return (<DateTimeDeliverySlot
          key={i}
          {...slot}
          checked={this._isSelected(slot)}
          onTimeChangeHandler={this._onTimeChangeHandler}>
        </DateTimeDeliverySlot>);
      }else{
        return <div key={i} className={emptyClassName}></div>;
      }
    })
    :<div className={emptyClassName}></div>
  }

  _getDayContent(){
    let classNames = ClassNameUtil.getClassNames(['fbra_dateTimeDeliveryColumn__dayContentContainer', 'fbra_test_dateTimeDeliveryColumn__dayContentContainer'])
      .concat(this.props.isActiveDay ? ' fbra_dateTimeDeliveryColumn__dayContentContainer--active' : '');
    let allDay =  this._getAllDaySlotContent(this.props.deliverySlots);
    let customSlots = this._getCustomSlotsContent(this.props.deliverySlots.customTimeSlots);

    return (
      <div className={classNames} key={this.props.key}>
        <div className={ClassNameUtil.getClassNames(['fbra_dateTimeDeliveryColumn__calendarDay', 'fbra_test_dateTimeDeliveryColumn__calendarDay'])}>
          {DateUtil.format(this.props.calendarDate, 'dddd')}
        </div>
        <div className={ClassNameUtil.getClassNames(['fbra_dateTimeDeliveryColumn__calendarDate', 'fbra_test_dateTimeDeliveryColumn__calendarDate'])}>
          {DateUtil.format(this.props.calendarDate, 'DD MMM')}
        </div>
        <div>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDeliveryColumn__selectAllDayText', 'fbra_test_dateTimeDeliveryColumn__selectAllDayText'])}>
            {this.props.selectAllDayText}
          </Label>
          {allDay}
        </div>
        <div>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDeliveryColumn__selectCustomSlotText', 'fbra_test_dateTimeDeliveryColumn__selectCustomSlotText'])}>
            {this.props.selectCustomSlotText}
          </Label>
          {customSlots}
        </div>
      </div>
    );
  }

  render(){
    const classNames = ClassNameUtil.getComponentClassNames(this);
    const dayContent = this._getDayContent();

    return(
      <div className={classNames} key={this.props.key}>
        {dayContent}
      </div>
    );
  }
}

DateTimeDeliveryDayColumn.defaultProps = {
  defaultClassName: 'fbra_dateTimeDeliveryColumn',
  className: '',
  classNames: [],
  isActiveDay: false
}

DateTimeDeliveryDayColumn.propTypes = {
  selectedDateTime: PropTypes.string,
  deliverySlots: PropTypes.shape({
    calendarDate: PropTypes.string,
    allDayTimeSlot: PropTypes.shape({
      timeSlotId:PropTypes.string,
      timeRange:PropTypes.string,
      shippingCost:Price.PropTypes.priceDataShape,
      selected :PropTypes.bool
    }),
    key: PropTypes.number,
    customTimeSlots: PropTypes.array
  }),
  selectAllDayText: PropTypes.string,
  selectCustomSlotText: PropTypes.string,
  isActiveDay: PropTypes.bool
}
