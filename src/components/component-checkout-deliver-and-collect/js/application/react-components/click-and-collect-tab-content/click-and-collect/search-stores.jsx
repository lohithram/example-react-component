import React, { Component, PropTypes } from 'react';
import { Button, ClassNameUtil, FormUtil, ValidatedField, GoogleMapUtil, SocialKeyStore } from '../../../class-library';

var placeSearch, autocomplete;

export default class SearchStores extends Component {
  constructor(props) {
    super(props);
    this._bindHandlers();
    this.state = {
      searchValue: props.locationSearchField.savedValue,
      place: null
    }
  }

  componentDidMount() {
    if(window.google) {
      this._handleGoogleInit();
      return;
    }

    GoogleMapUtil.includeGoogleMapsApi(SocialKeyStore.getGoogleMapsApiKey(), () => {
      this._handleGoogleInit();
    });
  }

  _bindHandlers() {
    this._handleGoogleInit = this._handleGoogleInit.bind(this);
    this._handleSearchInputChange = this._handleSearchInputChange.bind(this);
    this._handleSearchInputFocus = this._handleSearchInputFocus.bind(this);
    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
    this._handleSetPlaceCoordinates = this._handleSetPlaceCoordinates.bind(this);
    this._getCoordinates = this._getCoordinates.bind(this);
  }

  _handleGoogleInit() {
    if(!this.props.useGoogleMapsAPI) return;

    autocomplete = new google.maps.places.Autocomplete(
      (document.querySelector('[name="locationSearchText"]')),
      { types: ['geocode'] });
    autocomplete.addListener('place_changed', this._handleSetPlaceCoordinates);
  }

  _handleSearchInputFocus() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  _handleSearchInputChange(event) {
    event.preventDefault();
    const { place, searchValue } = this.state;
    if(event.target.value === '') {
      this.setState({ searchValue: '', place: null });
      return;
    }

    if(place && place.formatted_address) {
      this.setState({ searchValue: place.formatted_address });
    }
    else {
      this.setState({ searchValue: event.target.value });
    }
    if(place && place.geometry) {
      this.props.onSearchValueChange(searchValue, this._getCoordinates());
    }
  }

  _handleSearchSubmit() {
    const { searchValue } = this.state;
    this.props.onSearchSubmit(searchValue, this._getCoordinates());
  }

  _handleSetPlaceCoordinates() {
    let place = autocomplete.getPlace();
    this.setState({ place: place });
    let event = new Event('input', { bubbles: true, target: { value: place.formatted_address } });
    document.querySelector('[name="locationSearchText"]').value=place.formatted_address;
    document.querySelector('[name="locationSearchText"]').dispatchEvent(event);
  }

  _getCoordinates() {
    const { place } = this.state;
    return place && place.geometry ? {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    } : null;
  }

  render() {
    const { locationSearchField, locationSearchButton } = this.props;
    const getFormElement = (field, handlers) => <ValidatedField formContext={this.props.formContext} {...{field, handlers}} />;
    return (
      <div className={ ClassNameUtil.getClassNames(['fbra_searchLocation', 'fbra_test_searchLocation']) }>
        { getFormElement($.extend({}, locationSearchField), {
          onChange: this._handleSearchInputChange,
          onFocus: this._handleSearchInputFocus
        })}
        { FormUtil.getFormElement(locationSearchButton, { onClick: this._handleSearchSubmit }) }
      </div>
    );
  }
}

SearchStores.propTypes = {
  formContext: PropTypes.string.isRequired,
  locationSearchField: PropTypes.object.isRequired,
  locationSearchButton: PropTypes.object.isRequired,
  useGoogleMapsAPI: PropTypes.bool.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onSearchValueChange: PropTypes.func.isRequired
}

SearchStores.defaultProps = {
  locationSearchField: {},
  locationSearchButton: {},
  useGoogleMapsAPI: true,
  onSearchSubmit: () => {},
  onSearchValueChange: () => {}
}
