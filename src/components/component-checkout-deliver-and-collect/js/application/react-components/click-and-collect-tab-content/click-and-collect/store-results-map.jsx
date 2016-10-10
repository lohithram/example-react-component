import React, { Component, PropTypes } from 'react';
import { ClassNameUtil, GoogleMap, GoogleMapMarker } from "../../../class-library";
import StoreResultsListItem from './store-results-list-item';

export default class StoreResultsMap extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
  }

  bindHandlers() {
    this.handleMapMarkerClick = this.handleMapMarkerClick.bind(this);
    this.handleSelectStoreButtonClick = this.handleSelectStoreButtonClick.bind(this);
    this.handleCollectionTimeChange = this.handleCollectionTimeChange.bind(this);
  }

  /**
  * Handles Map marker click event
  */
  handleMapMarkerClick(storeId) {
    this.props.onMapMarkerClick(storeId);
  }

  /**
  * Handles select store click event
  */
  handleSelectStoreButtonClick(storeId) {
    this.props.onSelectStoreButtonClick(storeId);
  }

  handleCollectionTimeChange(storeId, value) {
    this.props.onCollectionTimeChange(storeId, value);
  }

  /**
  * Render map markers as map children
  * @returns {component}
  */
  renderMarkers() {
    const { listOfStores } = this.props;
    return listOfStores.map((store) => {
      return (<GoogleMapMarker key={store.storeId} latLng={{lat: store.latitude, lng: store.longitude}} onClick={this.handleMapMarkerClick} />);
    });
  }

  /**
  * Render selected Store component
  * @returns {component}
  */
  renderStore() {
    const { selectText, storeId, newDriveThruText, weHaveADriveThruText, seeMoreText } = this.props;
    const store = this.props.listOfStores.find(store => store.storeId === storeId);
    if(store) {
      return (
        <StoreResultsListItem
          activeView={1}
          store={store}
          newDriveThruText={newDriveThruText}
          weHaveADriveThruText={weHaveADriveThruText}
          seeMoreText={seeMoreText}
          onSelectStoreButtonClick={this.handleSelectStoreButtonClick}
          onCollectionTimeChange={this.handleCollectionTimeChange} />
      );
    }

    return null;
  }

  render() {
    return (
      <div className={ClassNameUtil.getClassNames(["fbra_locationResultsMap", "fbra_test_locationResultsMap"])}>
        <GoogleMap id={this.props.deliveryGroupId} className={ClassNameUtil.getClassNames(["fbra_locationResultsMap__googleMap", "fbra_test_locationResultsMap__googleMap"])}>
        	{this.renderMarkers()}
        </GoogleMap>
        {this.renderStore()}
      </div>
    );
  }
}

StoreResultsMap.propTypes = {
  deliveryGroupId: PropTypes.string.isRequired,
  newDriveThruText: PropTypes.string.isRequired,
  weHaveADriveThruText: PropTypes.string.isRequired,
  seeMoreText: PropTypes.string.isRequired,
  listOfStores: PropTypes.array.isRequired,
  storeId: PropTypes.string,
  onSelectStoreButtonClick: PropTypes.func.isRequired,
  onMapMarkerClick: PropTypes.func.isRequired,
  onCollectionTimeChange: PropTypes.func
}

StoreResultsMap.defaultProps = {
  listOfStores: [],
  storeId: '',
  onSelectStoreButtonClick: () => {},
  onMapMarkerClick: () => {}
}
