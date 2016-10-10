import React, { Component, PropTypes } from 'react';
import { Button, ClassNameUtil, DebugUtil, Label, LoadingIndicator, Text } from '../../../class-library';
import DateTimeDeliveryNavigation from './date-time-delivery-navigation';
import DateTimeDeliveryDayColumn from './date-time-delivery-day-column.jsx';

const emptyClassName = ClassNameUtil.getClassNames(["fbra_timeSlot__empty"]);
const baseClass = 'fbra_dateTimeDelivery';
const testBaseClass = 'fbra_test_dateTimeDelivery';

export default class DateTimeDeliveryContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: props.initialPageIndex,
      activeDayIndex: 0
    };
    this._bindHandlers();
  }

  _bindHandlers() {
    this._onSelectTimeSlot = this._onSelectTimeSlot.bind(this);
    this._onSelectDayIndex = this._onSelectDayIndex.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // If we are receiving a deliverySlotsIndex prop with a new page, we need
    // to switch the state to that new page.
    const newPageIndex = this._getNewPageIndex(this.props, newProps);
    if (typeof newPageIndex !== 'undefined') {
      this.setState({
        pageIndex: newPageIndex,
        activeDayIndex: newProps.deliverySlotsIndex[newPageIndex].length < this.state.activeDayIndex ? 0 : this.state.activeDayIndex
      });
    }
  }

  _getNewPageIndex(oldProps, newProps) {
    const notAlreadyExists = k => !(k in oldProps.deliverySlotsIndex);
    const newDeliverySlotsPages = Object.keys(newProps.deliverySlotsIndex).filter(notAlreadyExists);
    if (newDeliverySlotsPages.length > 0) {
      return parseInt(newDeliverySlotsPages[0], 10);
    }
  }

  _onSelectTimeSlot(timeSlotId) {
    this.props.onSelectTimeSlot(this.state.pageIndex, timeSlotId);
  }

  _onSelectDayIndex(activeDayIndex) {
    this.setState({ activeDayIndex });
  }

  _getDeliverySlotRanges() {
    // TODO this might need doing on a page-by-page basis like deliverySlots
    return this.props.deliverySlotRanges;
  }

  _getTimesSlots() {
    const deliverySlotRanges = this._getDeliverySlotRanges();
    if (typeof deliverySlotRanges === 'undefined') return;
    return [deliverySlotRanges.allDayTimeSlotRange].concat(deliverySlotRanges.customTimeSlotRange);
  }

  _getTimeSlotsColumn(key) {
    const classNames = ClassNameUtil.getClassNames([`${this.props.defaultClassName}__timeSlotsColumn`]);
    let timeSlotsColumn = this._getTimesSlots();
    if (typeof timeSlotsColumn === 'undefined') return;

    let customTimes = timeSlotsColumn.map((time, i) => {
      return (
        <div
          className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__customTimeContainer', 'fbra_test_dateTimeDelivery__customTimeContainer'])}
          key={i}>
          <Text
            key={i + 1}
            className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__customTime', 'fbra_test_dateTimeDelivery__customTime'])}>
            {time}
          </Text>
        </div>
      );
    });

    return (
      <div className={classNames} key={key}>
        <div className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__selectAllDayContainer', 'fbra_test_dateTimeDelivery__selectAllDayContainer'])}>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__selectAllDayText', 'fbra_test_dateTimeDelivery__selectAllDayText'])}>{this.props.textDictionary.selectAllDayText}</Label>
        </div>
        <div className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__timeSlotContainer', 'fbra_test_dateTimeDelivery__timeSlotContainer'])}>
          <Text className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__timeSlot', 'fbra_test_dateTimeDelivery__timeSlot'])}>{timeSlotsColumn[0]}</Text>
        </div>
        <div className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__selectCustomSlotContainer', 'fbra_test_dateTimeDelivery__selectCustomSlotContainer'])}>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__selectCustomerSlotText', 'fbra_test_dateTimeDelivery__selectCustomerSlotText'])}>{this.props.textDictionary.selectCustomSlotText}</Label>
        </div>
        {customTimes}
      </div>
    );
  }

  _getDeliverySlots() {
    return this.props.deliverySlotsIndex[this.state.pageIndex];
  }

  _getLoadingContent() {
    return null;
  }

  _getDateTimeColumnsContent() {
    const deliverySlots = this._getDeliverySlots();

    if (typeof deliverySlots === 'undefined') {
      return this._getLoadingContent();
    }

    const daySlotsContent = deliverySlots.map(
      (deliverySlot, index) => {
        return (
          <DateTimeDeliveryDayColumn
          key={ index }
          isActiveDay={ this.state.activeDayIndex === index }
          selectedDateTime={ this.props.selectedTimeSlotId }
          deliverySlots={ deliverySlot }
          onTimeChangeHandler={ this._onSelectTimeSlot }
          calendarDate={ deliverySlot.calendarDate }
          selectAllDayText={this.props.textDictionary.selectAllDayText}
          selectCustomSlotText={this.props.textDictionary.selectCustomSlotText} />
        );
      }
    );

    return [
      this._getTimeSlotsColumn(1001),
      <div key={1002} className={ClassNameUtil.getClassNames([`${this.props.defaultClassName}__daySlotsColumn`])}>{daySlotsContent}</div>
    ];
  }

  _getPayOnDeliveryContent() {
    //3 - Cash on delivery
    if (this.props.shippingMethodType === 3) {
      return (
        <section className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__payOnDelivery', 'fbra_test_dateTimeDelivery__payOnDelivery'])}>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__creditCardsAcceptedText', 'fbra_test_dateTimeDelivery__creditCardsAcceptedText'])}>{this.props.textDictionary.creditCardsAcceptedText}</Label>
          <Label className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__payOnDeliverySelectedText', 'fbra_test_dateTimeDelivery__payOnDeliverySelectedText'])}>{this.props.textDictionary.payOnDeliverySelectedText}</Label>
        </section>
      );
    }

    return null;
  }

  _isPageIndexTooLow(pageIndex) {
    return pageIndex < 0;
  }

  _isPageIndexTooHigh(pageIndex) {
    return pageIndex >= this.props.maximumNumberOfWeeks;
  }

  _isPrevLinkShown() {
    return !this._isPageIndexTooLow(this.state.pageIndex - 1);
  }

  _isNextLinkShown() {
    return !this._isPageIndexTooHigh(this.state.pageIndex + 1);
  }

  _next() {
    return this._goToPage(this.state.pageIndex + 1);
  }

  _prev() {
    return this._goToPage(this.state.pageIndex - 1);
  }

  _goToPage(pageIndex) {
    // If the desired pageIndex is out of bounds, don’t do anything
    if (this._isPageIndexTooHigh(pageIndex)) return;
    if (this._isPageIndexTooLow(pageIndex)) return;

    // If we have the deliverySlots for this pageIndex cached, simply switch
    // to that page
    if (pageIndex in this.props.deliverySlotsIndex) {
      return this.setState({
        pageIndex,
        activeDayIndex: this.props.deliverySlotsIndex[pageIndex].length < this.state.activeDayIndex ? 0 : this.state.activeDayIndex
      });
    }

    // Request missing slots. When these arrive via the deliverySlotsIndex prop
    // we can switch to the new page automatically, rather than optimistically
    // switching now.
    this.props.onRequestDeliverySlots(pageIndex);
  }

  _renderNavigation() {
    const prevLink = {
      isShown: this._isPrevLinkShown(),
      text: this.props.textDictionary.goToPreviousPageText,
      classNames: [`${baseClass}__paginationButton--prev`, `${testBaseClass}__paginationButton--prev`],
      handler: this._prev
    }

    const nextLink = {
      isShown: this._isNextLinkShown(),
      text: this.props.textDictionary.goToNextPageText,
      classNames: [`${baseClass}__paginationButton--next`, `${testBaseClass}__paginationButton--next`],
      handler: this._next
    }

    return (
      <DateTimeDeliveryNavigation
        activeDayIndex={ this.state.activeDayIndex }
        deliverySlots={ this._getDeliverySlots() }
        onSelectDayIndex={ this._onSelectDayIndex }
        prevLink={ prevLink }
        nextLink={ nextLink }
        />
    )
  }

  _renderPaginationButton(text, handler, classNames=[]) {
    return (
      <Button
        onClick={ handler }
        classNames={ ClassNameUtil.getClassNames(
          [`${this.props.defaultClassName}__paginationButton`].concat(classNames)
        )}
      >
        { text }
      </Button>
    );
  }

  render() {
    return(
      <section classNames={ClassNameUtil.getComponentClassNames(this)}>
        {/* Wrap in a form to prevent radio button name conflicts */}
        <form className={ClassNameUtil.getClassNames(['fbra_dateTimeDelivery__deliveryForm', 'fbra_test_dateTimeDelivery__deliveryForm'])}>
          {this._renderNavigation()}
          {this._getPayOnDeliveryContent()}
          {this._getDateTimeColumnsContent()}

          { this._isPrevLinkShown() && this._renderPaginationButton(
            this.props.textDictionary.goToPreviousPageText,
            this._prev,
            [`${this.props.defaultClassName}__paginationButton--prev`]
          ) }

          { this._isNextLinkShown() && this._renderPaginationButton(
            this.props.textDictionary.goToNextPageText,
            this._next,
            [`${this.props.defaultClassName}__paginationButton--next`]
          ) }
        </form>
      </section>
    );
  }
}

DateTimeDeliveryContainer.PropTypes = {
  textDictionary: {
    selectAllDayText: PropTypes.string.isRequired,
    selectCustomSlotText: PropTypes.string.isRequired,
    creditCardsAcceptedText: PropTypes.string.isRequired,
    payOnDeliverySelectedText: PropTypes.string.isRequired,
    goToPreviousPageText: PropTypes.string.isRequired,
    goToNextPageText: PropTypes.string.isRequired
  }
};

DateTimeDeliveryContainer.propTypes = {
  shippingMethodType: PropTypes.number,
  selectedTimeSlotId: PropTypes.string,
  initialPageIndex: PropTypes.number,
  maximumNumberOfWeeks: PropTypes.number,
  deliverySlotsIndex: PropTypes.object.isRequired,
  deliverySlotRanges: PropTypes.object.isRequired,
  onRequestDeliverySlots: PropTypes.func,
  onSelectTimeSlot: PropTypes.func,
  textDictionary: PropTypes.shape(DateTimeDeliveryContainer.PropTypes.textDictionary).isRequired,
  className: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string)
};

DateTimeDeliveryContainer.defaultProps = {
  initialPageIndex: 0,
  maximumNumberOfWeeks: 4,
  deliverySlotsIndex: {},
  onRequestDeliverySlots: () => {},
  onSelectTimeSlot: () => {},
  defaultClassName: 'fbra_dateTimeDelivery',
  className: '',
  classNames: []
}
