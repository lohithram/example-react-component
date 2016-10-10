import { Component, PropTypes } from 'react';
import {
  DebugUtil, ComponentUtil, ClassNameUtil,
  Section, Paragraph, Text, Anchor
} from "../../class-library";

export default class AddressSummary extends Component {

  constructor(props) {
    super(props);
    this.bindHandlers();
  }

  /**
   * Event Handling
   * @Add all local events below:
   *
   */

  bindHandlers() {
    this.handleEditAddressLinkClick = this._handleEditAddressLinkClick.bind(this);
    this.handleAddDifferentAddressLinkClick = this._handleAddDifferentAddressLinkClick.bind(this);
  }

  _handleEditAddressLinkClick(event) {
    event.preventDefault();
    this.props.onEditAddressLinkClick();
  }

  _handleAddDifferentAddressLinkClick(event) {
    event.preventDefault();
    this.props.onAddDifferentAddressLinkClick();
  }

  /**
   * Content Handling
   * @Add all getContent methods below:
   *
   */

   _getAddressContent() {
     if(this.props.orderAddress && this.props.orderAddress.customerAddress && this.props.orderAddress.customerDivision) {
       return (
         <Paragraph className={ ClassNameUtil.getClassNames(["fbra_addressSummary__orderAddress", "fbra_test_addressSummary__orderAddress"])}>
           <Text className={ ClassNameUtil.getClassNames(["fbra_addressSummary__orderAddressCustomerAddress", "fbra_test_addressSummary__orderAddress__customerAddress"])}>
             { this.props.orderAddress.customerAddress }
           </Text>
           <Text className={ ClassNameUtil.getClassNames(["fbra_addressSummary__orderAddressCustomerDivision", "fbra_test_addressSummary__orderAddress__customerDivision"])}>
             { this.props.orderAddress.customerDivision }
           </Text>
         </Paragraph>
       );
     }
     return null;
   }

  _getEditAddressLinkContent() {
    if(!this.props.isMaster)
      return null;
      
    return (
      <Anchor className={ ClassNameUtil.getClassNames(["fbra_addressSummary__editAddressLink", "fbra_test_addressSummary__editAddressLink", "fbra_test_addressSummary__orderAddress__editAddressLink"])} onClick={this.handleEditAddressLinkClick}>
        { this.props.editText }
      </Anchor>
    );
  }

  /**
   * Render Method
   * @Render Component:
   *
   */
  render() {
    const addressContent = this._getAddressContent();
    const editAddressLinkContent = this._getEditAddressLinkContent();

    if(addressContent) {
      return (
        <Section className={ ClassNameUtil.getComponentClassNames(this)}>
        { addressContent }
        { editAddressLinkContent }
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

AddressSummary.propTypes = {
  classNames: PropTypes.array,
  orderAddress: PropTypes.shape({
    addressId: PropTypes.string,
    customerAddress: PropTypes.string.isRequired,
    customerDivision: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string
  }).isRequired,
  onEditAddressLinkClick: PropTypes.func,
  onAddDifferentAddressLinkClick: PropTypes.func,
  addDifferentAddressText: PropTypes.string.isRequired,
  editText: PropTypes.string.isRequired,
  isMaster: PropTypes.bool.isRequired
}

/**
 * Default Props
 * @define any default props:
 *
 */

AddressSummary.defaultProps = {
  defaultClassName: 'fbra_addressSummary fbra_test_addressSummary',
  className: '',
  classNames: [],
  isMaster: true
}
