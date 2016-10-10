import React, { Component, PropTypes } from 'react';
import { ClassNameUtil, DateUtil, Button, List, ListItem, Anchor, Text } from '../../../class-library';

const baseClass = 'fbra_dateTimeDeliveryNavigation';
const testBaseClass = 'fbra_test_dateTimeDeliveryNavigation';

export default class DateTimeDeliveryNavigation extends Component {
  constructor(props) {
    super(props);
  }

  _handleSelectDayIndex(index, event) {
    event.preventDefault();
    this.props.onSelectDayIndex(index);
  }

  _getSelectedDeliverySlot() {
    return this.props.deliverySlots[this.props.activeDayIndex] || {};
  }

  _renderPaginationButton({ isShown, text, handler, classNames }) {
    if(!isShown) return null;

    return (
      <Button
        onClick={ handler }
        classNames={ ClassNameUtil.getClassNames(
          [`${baseClass}__paginationButton`].concat(classNames)
        )}
      >
        { text }
      </Button>
    );
  }

  _renderDeliveryDays() {
    return this.props.deliverySlots.map((deliverySlot, index) =>
      <ListItem key={index} className={ ClassNameUtil.getClassNames([`${baseClass}__day`, `${testBaseClass}__day`]).concat(this.props.activeDayIndex === index ? ` ${baseClass}__day--active` : '') }>
        <Anchor onClick={this._handleSelectDayIndex.bind(this, index)}>
          {DateUtil.format(deliverySlot.calendarDate, 'dd')}
          {DateUtil.format(deliverySlot.calendarDate, 'D')}
        </Anchor>
      </ListItem>
    );
  }

  render() {
    const selectedDeliverySlot = this._getSelectedDeliverySlot();
    return (
      <div className={ ClassNameUtil.getComponentClassNames(this) }>
        {this._renderPaginationButton(this.props.prevLink)}
        <List>
          {this._renderDeliveryDays()}
        </List>
        {this._renderPaginationButton(this.props.nextLink)}
        <Text className={ ClassNameUtil.getClassNames([`${baseClass}__selectedDeliveryDay`, `${testBaseClass}__selectedDeliveryDay`]) }>
          {DateUtil.format(selectedDeliverySlot.calendarDate, 'dddd MMMM Do YYYY')}
        </Text>
      </div>
    );
  }
}

DateTimeDeliveryNavigation.propTypes = {
  activeDayIndex: PropTypes.number,
  deliverySlots: PropTypes.array,
  onSelectDayIndex: PropTypes.func,
  prevLink: PropTypes.object,
  nextLink: PropTypes.object
}

DateTimeDeliveryNavigation.defaultProps = {
  defaultClassName: `${baseClass} ${testBaseClass}`,
  className: '',
  classNames: [],
  activeDayIndex: 0,
  deliverySlots: [],
  onSelectDayIndex: () => {},
  prevLink: {},
  nextLink: {}
}
