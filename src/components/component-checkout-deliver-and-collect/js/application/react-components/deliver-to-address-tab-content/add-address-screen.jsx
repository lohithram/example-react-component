import React, { Component, PropTypes } from 'react';
import AddressFormContainer from './address-form-container';
export default class AddAddressScreen extends Component{

  _getMasterContent(){
    return(
      <AddressFormContainer endPoints={this.props.endPoints} textDictionary={this.props.textDictionary} />
    );
  }

  _getSlaveContent(){
    return null;
  }

  render(){
    return this.props.isMaster ? this._getMasterContent() : this._getSlaveContent();
  }

}
AddAddressScreen.propTypes = {
  textDictionary: PropTypes.object.isRequired,
  endPoints: PropTypes.object.isRequired,
  isMaster: PropTypes.bool.isRequired
}
AddAddressScreen.defaultProps = {
  isMaster: true
}
