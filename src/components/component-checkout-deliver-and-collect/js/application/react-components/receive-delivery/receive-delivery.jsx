import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  Collapsible,
  Form,
  FormUtil,
  IdTypeSelector,
  ObjectUtil,
  ValidatedField
} from '../../class-library';
import ReceiveDeliveryOptions from '../../constants/receive-delivery-options';
const field = FormUtil.PropTypes.fieldDataShape;

export default class ReceiveDelivery extends Component {
  /**
   * Change handler for form data
   */
  _onChange(name, value) {
    this.props.onChange({ name, value });
  }

  /**
   * Find the value of the selected option
   */
  _getInitialWhoWillCollectValue() {
    const option = this.props.whoWillCollect.fieldOptions.find(x => x.selected);
    return typeof option === 'undefined' ? undefined : option.value;
  }

  /**
   * Render the third person Id selector form
   */
  _renderThirdPersonIdForm() {
    const {
      initialThirdPersonId,
      thirdPersonIdSelectorLink,
      initialThirdPersonIdType,
      thirdPersonIdSelectorAction
    } = this.props;

    if (initialThirdPersonId) {
      return (
        <IdTypeSelector
          classNames={['fbra_receiveDelivery__idTypeSelector', 'fbra_test_receiveDelivery__idTypeSelector']}
          initialIdField={ initialThirdPersonId }
          initialIdTypeField={ initialThirdPersonIdType }
          showIdTypeField={ thirdPersonIdSelectorLink }
          confirmIdTypeField={ thirdPersonIdSelectorAction }
          onChangeId={ initialThirdPersonId ? this._onChange.bind(this, initialThirdPersonId.fieldName) : null }
          onChangeType={ initialThirdPersonIdType ? this._onChange.bind(this, initialThirdPersonIdType.fieldName) : null }
          formContext={ this.props.formContext }
        />
      );
    }
  }

  /**
   * Render the third person recipient form
   */
  _renderRecipientForm() {
    const {
      thirdPersonFirstName,
      thirdPersonLastName,
      thirdPersonPhoneNumber
    } = this.props;

    const handler = ({ fieldName }) => ({ onChange: e => this._onChange(fieldName, e.target.value) });

    return (
      <div className={ClassNameUtil.getClassNames(['fbra_receiveDelivery__recipientForm', 'fbra_test_receiveDelivery__recipientForm'])}>
        { this._getFormElement(thirdPersonFirstName, handler(thirdPersonFirstName)) }
        { this._getFormElement(thirdPersonLastName, handler(thirdPersonLastName)) }
        { thirdPersonPhoneNumber && this._getFormElement(thirdPersonPhoneNumber, handler(thirdPersonPhoneNumber)) }

        { this._renderThirdPersonIdForm() }
      </div>
    );
  }

  _getFormElement(field, handlers) {
    return <ValidatedField formContext={this.props.formContext} {...{field, handlers}}/>
  }

  render() {
    const whoWillCollectValue = this._getInitialWhoWillCollectValue();
    // Strip the label
    const whoWillCollectOptionsField = ObjectUtil.dissoc('label', this.props.whoWillCollect);
    whoWillCollectOptionsField.radioOptionClassName = 'fbra_formItem fbra_receiveDeliveryRadioButtons';

    return (
      <div className={ ClassNameUtil.getComponentClassNames(this) }>
        <Form className={ClassNameUtil.getClassNames(['fbra_receiveDelivery__form', 'fbra_test_receiveDelivery__form'])}>
          { this._getFormElement(
            // Strip the label
            ObjectUtil.dissoc('label', this.props.whoWillCollect),
            { onChange: this._onChange.bind(this, this.props.whoWillCollect.fieldName) }
          ) }

          <Collapsible
            className={ClassNameUtil.getClassNames(['fbra_receiveDelivery__collapsible', 'fbra_test_receiveDelivery__collapsible'])}
            activeItems={ [whoWillCollectValue] }
            allowMultiple={ false }
          >
            <Collapsible.Item identifier={ ReceiveDeliveryOptions.THIRD_PARTY_RECEIVE_DELIVERY } className={ClassNameUtil.getClassNames(['fbra_receiveDelivery__collapsibleItem', 'fbra_test_receiveDelivery__collapsibleItem'])}>
              <Collapsible.Body classNames={ClassNameUtil.getClassNames(['fbra_receiveDelivery__collapsibleBody', 'fbra_test_receiveDelivery__collapsibleBody'])}>
                { this._renderRecipientForm() }
              </Collapsible.Body>
            </Collapsible.Item>
          </Collapsible>
        </Form>
      </div>
    );
  }
}

ReceiveDelivery.propTypes = {

  /**
   * The whoWillCollect radio options, the state of this will be tracked by this
   * component in order to show/hide the third person recipient fields, but
   * the state of the rendered field won’t be affected, so this is not prefixed
   * with 'initial'
   */
  whoWillCollect: field.isRequired,

  /**
   * The standard, controlled third person recipient fields
   */
  thirdPersonFirstName: field.isRequired,
  thirdPersonLastName: field.isRequired,
  thirdPersonPhoneNumber: field,

  /**
   * The third person Id field, e.g. passport number. The label will be managed
   * hence the 'initial' prefix
   */
  initialThirdPersonId: field,

  /**
   * The link to select a different Id type
   */
  thirdPersonIdSelectorLink: field,

  /**
   * The Id type radios - state will be managed, hence the 'initial' prefix
   */
  initialThirdPersonIdType: field,

  /**
   * The button to confirm a different Id type
   */
  thirdPersonIdSelectorAction: field,

  /**
   * The form context
   */
  formContext: PropTypes.string.isRequired,

  /**
   * Change handler
   */
  onChange: PropTypes.func,

  className: PropTypes.string,
  classNames: PropTypes.any
}

ReceiveDelivery.defaultProps = {
  onChange: () => {},
  defaultClassName: 'fbra_receiveDelivery',
  className: '',
  classNames: []
}
