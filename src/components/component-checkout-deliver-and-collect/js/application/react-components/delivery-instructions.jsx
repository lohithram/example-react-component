import { Component, PropTypes } from 'react';
import {
  ObjectUtil,
  ClassNameUtil,
  Collapsible,
  DeliverAndCollectFormIdentifier as FormIdentifier,
  FormUtil,
  Section,
  ValidatedField
} from '../class-library';

export default class DeliveryInstructions extends Component {

  /**
   * Component Lifestyle
   * @Run through the component lifestyle; constructing, mounting, etc:
   *
   */

  constructor(props) {
    super(props);
    this.buildInitialState();
    this.bindHandlers();
  }

  buildInitialState() {
    this.state = {
      isActive: false
    }
  }

  /**
   * Event Handling
   * @Add all local events below:
   *
   */

  bindHandlers() {
    this.handleCollapsibleChange = this._handleCollapsibleChange.bind(this);
    this.handleTextareaChange = this._handleTextareaChange.bind(this);
  }

  _handleCollapsibleChange(event) {
    this.setState({ isActive: !this.state.isActive });
  }

  _handleTextareaChange(event) {
    this.props.onChange(event.target.value);
  }

  /**
   * Content Handling
   * @Add all getContent methods below:
   *
   */

  _getCollapsibleHeaderContent() {
    return this.props.deliveryInstructions && this.props.deliveryInstructions.label;
  }

  _getCollapsibleBodyContent() {
    if (this.props.deliveryInstructions) {
      const deliveryInstructionsField = ObjectUtil.assoc('label', '', this.props.deliveryInstructions);
      return (
        <ValidatedField
          formContext={FormIdentifier.deliveryInstructions(this.props.deliveryGroupId)}
          field={deliveryInstructionsField}
          handlers={{ onChange: this.handleTextareaChange.bind(this) }} />
      );
    }
    return null;
  }

  _getCollapsibleContent() {
    const collapsibleHeaderContent = this._getCollapsibleHeaderContent();
    const collapsibleBodyContent = this._getCollapsibleBodyContent();
    let collapsibleClassNames = ["fbra_deliveryInstructions__collapsible", "fbra_test_deliveryInstructions__collapsible"];
    if(this.state.isActive) {
      collapsibleClassNames.push("fbra_deliveryInstructions__collapsible--active", "fbra_test_deliveryInstructions__collapsible--active");
    }

    if(collapsibleHeaderContent && collapsibleBodyContent) {
      return (
        <Collapsible className={ ClassNameUtil.getClassNames(collapsibleClassNames)} onChange={this.handleCollapsibleChange}>
          <Collapsible.Item identifier={1} className={ ClassNameUtil.getClassNames(["fbra_deliveryInstructions__collapsibleItem", "fbra_test_deliveryInstructions__collapsibleItem", "fbra_test_deliveryInstructions__collapsible__item"])}>
            <Collapsible.Header className={ ClassNameUtil.getClassNames(["fbra_deliveryInstructions__collapsibleHeader", "fbra_test_deliveryInstructions__collapsibleHeader", "fbra_test_deliveryInstructions__collapsible__item__header"])}>
              { collapsibleHeaderContent }
            </Collapsible.Header>
            <Collapsible.Body className={ ClassNameUtil.getClassNames(["fbra_deliveryInstructions__collapsibleBody", "fbra_test_deliveryInstructions__collapsibleBody", "fbra_test_deliveryInstructions__collapsible__item__body"])}>
              { collapsibleBodyContent }
            </Collapsible.Body>
          </Collapsible.Item>
        </Collapsible>
      );
    }
    return null;
  }

  /**
   * Render Method
   * @Render Component:
   *
   */

  render() {
    const collapsibleContent = this._getCollapsibleContent();

    if (collapsibleContent) {
      return (
        <Section className={ ClassNameUtil.getComponentClassNames(this)}>
          { collapsibleContent }
        </Section>
      );
    }
    return null;
  }
}

/**
 * Prop Types
 * @define expected prop types:
 *
 */

DeliveryInstructions.propTypes = {
  deliveryGroupId: PropTypes.string,
  deliveryInstructionsText: PropTypes.string,
  deliveryInstructions: PropTypes.shape({
    fieldName: PropTypes.string,
    fieldType: PropTypes.number,
    label: PropTypes.string,
    tooltipText: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func,
  classNames: PropTypes.array
}

/**
 * Default Props
 * @define any default props:
 *
 */

DeliveryInstructions.defaultProps = {
  onChange: () => {},
  defaultClassName: 'fbra_deliveryInstructions fbra_test_deliveryInstructions',
  className: '',
  classNames: []
}
