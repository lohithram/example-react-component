import React, { Component, PropTypes } from 'react';
import AddressBook from './address-book';
import AddressFormContainer from './address-form-container';
import AddressActions from '../../actions/address-actions';
import ModalActions from '../../actions/modal-actions';

import {
  Anchor,
  ClassNameUtil,
  Collapsible,
  Heading,
  Paragraph,
  DebugUtil,
  ModalTemplates,
  ContextUtil,
  ApplicationDispatcher,
  ModalComponentTypes
} from '../../class-library';

const IDENTIFIER__ADDRESS_BOOK = 'AddressBook';
const IDENTIFIER__ADDRESS_FORM = 'AddressForm';

export default class SelectAddressScreen extends Component {

  constructor(props) {
    super(props);

    this.requestContext = ContextUtil.getUniqueContext("selectAddressScreen");
    this.state = {
      activeCollapsibleItem: IDENTIFIER__ADDRESS_BOOK
    };
  }

  _setActiveCollapsibleItem(newItem) {
    this.setState({ activeCollapsibleItem: newItem });
  }

  /**
   * _removeAddressClickHandler
   * Click handler for the remove address button click
   */
  _removeAddressClickHandler(address) {
    const textDictionary = this.props.textDictionary;
    DebugUtil.log("Prompting User to confirm address removal - ", address);
    ModalActions.showModal(ModalTemplates.SIMPLE_ACTION_MODAL, {
        headerContent: textDictionary.deleteAddressConfirmationTitleText,
        content: textDictionary.deleteAddressConfirmationText,
        yesText: textDictionary.deleteAddressConfirmationYesText,
        noText: textDictionary.deleteAddressConfirmationNoText,
        onFirstOptionSelected: this._onUserAddressRemoveConfirm.bind(this, address)
      });
  }

  /**
   * _onUserAddressRemoveConfirm
   *
   */
  _onUserAddressRemoveConfirm(address){
    DebugUtil.log("User confirmed to remove address - ", address);

    let removeAddress = () => {
      AddressActions.removeSavedAddress(address.addressId, this.props.endPoints, this.requestContext);
    };

    if(this.props.requiresLogin){
      ApplicationDispatcher.dispatch({
        actionType: ModalComponentTypes.MODAL_COMPONENT_SIGNIN_SHOW,
        action: {
          callback: removeAddress
        }
      });
    } else {
      removeAddress();
    }
  }

  /**
   * _useAddressClickHandler
   * Click handler for the use address button click
   */
  _useAddressClickHandler(address) {
    DebugUtil.log("Request to use address");
    AddressActions.setSelectedAddress(address.addressId, this.props.endPoints, this.requestContext);
  }

  /**
   * Section header
   */
  _renderSectionHeading(text) {
    return <Heading level={3} className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__heading', 'fbra_test_selectAddressScreen__heading'])}>{ text }</Heading>;
  }

  /**
   * Intro text and link to address form
   */
  _renderIntroTextAndlink() {
    const { textDictionary } = this.props;
    return (
      <Paragraph className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__introText', 'fbra_test_selectAddressScreen__introText'])}>
        { textDictionary.selectFromYourAddressesText }
        {' '}
        <Anchor
          className={ ClassNameUtil.getClassNames(['fbra_selectAddressScreen__enterNewAddressLink', 'fbra_test_selectAddressScreen__enterNewAddressLink', 'fbra_test_cmpDeliverAndCollect__selectAddressScreenEnterNewAddressLink']) }
          onClick={ e => {
            e.preventDefault();
            this._setActiveCollapsibleItem(IDENTIFIER__ADDRESS_FORM);
          }}
        >
          { textDictionary.enterANewAddressText }
        </Anchor>
      </Paragraph>
    );
  }

  /**
   * AddressBook
   */
  _renderAddressBook() {
    const { savedAddresses, textDictionary } = this.props
    if (!savedAddresses) return null;

    return (
      <Collapsible.Item identifier={ IDENTIFIER__ADDRESS_BOOK } className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressBookCollapsibleItem', 'fbra_test_selectAddressScreen__addressBookCollapsibleItem'])}>
        <Collapsible.Header className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressBookCollapsibleHeader', 'fbra_test_selectAddressScreen__addressBookCollapsibleHeader'])}>
          { this._renderSectionHeading(textDictionary.yourAddressesText) }
        </Collapsible.Header>

        <Collapsible.Body className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressBookCollapsibleBody', 'fbra_test_selectAddressScreen__addressBookCollapsibleBody'])}>
          <AddressBook
            addresses={ savedAddresses }
            textDictionary={ textDictionary }
            removeAddressClickHandler={this._removeAddressClickHandler.bind(this)}
            useAddressClickHandler={this._useAddressClickHandler.bind(this)} />
        </Collapsible.Body>
      </Collapsible.Item>
    );
  }

  /**
   * AddressForm
   */
  _renderAddressForm() {
    const { endPoints, textDictionary } = this.props;

    return (
      <Collapsible.Item identifier={ IDENTIFIER__ADDRESS_FORM } className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressFormCollapsibleItem', 'fbra_test_selectAddressScreen__addressFormCollapsibleItem'])}>
        <Collapsible.Header className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressFormCollapsibleHeader', 'fbra_test_selectAddressScreen__addressFormCollapsibleHeader'])}>
          { this._renderSectionHeading(textDictionary.enterNewAddressText) }
        </Collapsible.Header>

        <Collapsible.Body className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__addressFormCollapsibleBody', 'fbra_test_selectAddressScreen__addressFormCollapsibleBody'])}>
          <AddressFormContainer
            endPoints={endPoints}
            textDictionary={textDictionary}
          />
        </Collapsible.Body>
      </Collapsible.Item>
    );
  }

  render() {
    return(
      <div className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen', 'fbra_test_selectAddressScreen'])}>
        { this._renderIntroTextAndlink() }

        <Collapsible
          className={ClassNameUtil.getClassNames(['fbra_selectAddressScreen__bookAndFormCollapsible', 'fbra_test_selectAddressScreen__bookAndFormCollapsible'])}
          activeItems={ [this.state.activeCollapsibleItem] }
          allowMultiple={ false }
          onChange={ ([newItem]) => this._setActiveCollapsibleItem(newItem) }
        >
          { this._renderAddressBook() }
          { this._renderAddressForm() }
        </Collapsible>
      </div>
    );
  }
}

/**
 * NB PropTypes not propTypes - useful for upstream validation
 */
SelectAddressScreen.PropTypes = {
  textDictionary: {
    enterANewAddressText: PropTypes.string.isRequired,
    selectFromYourAddressesText: PropTypes.string.isRequired,

    // AddressBook
    ...AddressBook.PropTypes.textDictionary,
    yourAddressesText: PropTypes.string.isRequired,

    // addressForm
    enterNewAddressText: PropTypes.string.isRequired
  }
}

/**
 * NB propTypes not PropTypes - standard React propTypes
 */
SelectAddressScreen.propTypes = {

  // savedAddresses validation, taken directly from AddressBook
  savedAddresses: AddressBook.propTypes.addresses,

  textDictionary: PropTypes.shape(SelectAddressScreen.PropTypes.textDictionary).isRequired,

  endPoints: PropTypes.object.isRequired
};
