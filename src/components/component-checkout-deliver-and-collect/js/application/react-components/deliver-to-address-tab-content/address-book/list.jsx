import React, { Component, PropTypes } from 'react';
import { DebugUtil, ClassNameUtil, List } from '../../../class-library';
import AddressBookItem from './item';

export default class AddressBookList extends Component {
  render() {
    return (
      <List className={ClassNameUtil.getComponentClassNames(this)}>
        { this.props.addresses.map( (item, index) => {
          return (
            <AddressBookItem
              key={item.address.addressId}
              address={item.address}
              isUnavailable={item.isUnavailable}
              useAddressClickHandler={this.props.useAddressClickHandler}
              removeAddressClickHandler={this.props.removeAddressClickHandler}
              useAddressText={this.props.textDictionary.useAddressText}
              removeText={this.props.textDictionary.deleteAddressConfirmationTitleText}
              thisAddressCanNotBeUsedText={this.props.textDictionary.thisAddressCanNotBeUsedText} />
          );
        }) }
      </List>
    )
  }
}

/**
 * NB PropTypes not propTypes - useful for upstream validation
 */
AddressBookList.PropTypes = {
  textDictionary: {
    useAddressText: PropTypes.string,
    deleteAddressConfirmationTitleText: PropTypes.string,
    thisAddressCanNotBeUsedText: PropTypes.string
  }
};

/**
 * NB propTypes not PropTypes - standard React propTypes
 */
AddressBookList.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({
    isUnavailable: PropTypes.bool,
    address: PropTypes.shape({
      addressId: PropTypes.string
    })
  })),
  textDictionary: PropTypes.shape(AddressBookList.PropTypes.textDictionary),
  useAddressClickHandler: PropTypes.func.isRequired,
  removeAddressClickHandler: PropTypes.func.isRequired
}

AddressBookList.defaultProps = {
  defaultClassName: 'fbra_componentDeliverAndCollect__addressBookList',
  className: '',
  classNames: [],
}
