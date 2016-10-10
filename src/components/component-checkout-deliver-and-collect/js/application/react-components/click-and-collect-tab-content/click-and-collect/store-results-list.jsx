import { Component, PropTypes } from 'react';
import { DebugUtil, ComponentUtil, ClassNameUtil, List } from "../../../class-library";
import StoreResultsListItem from './store-results-list-item';

export default class StoreResultsList extends Component {

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
    this.handleMapAndOpeningHoursLinkClick = this._handleMapAndOpeningHoursLinkClick.bind(this);
  	this.handleSelectStoreButtonClick = this._handleSelectStoreButtonClick.bind(this);
    this.handleCollectionTimeChange = this._handleCollectionTimeChange.bind(this);
  }

  _handleMapAndOpeningHoursLinkClick(storeId) {
    this.props.onMapAndOpeningHoursLinkClick(storeId);
  }

  _handleSelectStoreButtonClick(storeId) {
  	this.props.onSelectStoreButtonClick(storeId);
  }

  _handleCollectionTimeChange(storeId, value) {
    this.props.onCollectionTimeChange(storeId, value);
  }

  /**
   * Content Handling
   * @Add all getContent methods below:
   *
   */
  _getStoreResultListItemContent(store, index) {
    if(store) {
      return (
        <StoreResultsListItem
          key={store.storeId}
          store={store}
          isClosest={index === 0}
          closestFalabellaStoreText={this.props.closestFalabellaStoreText}
          mapAndOpeningHoursText={this.props.mapAndOpeningHoursText}
          newDriveThruText={this.props.newDriveThruText}
          weHaveADriveThruText={this.props.weHaveADriveThruText}
          seeMoreText={this.props.seeMoreText}
          onMapAndOpeningHoursLinkClick={this.handleMapAndOpeningHoursLinkClick}
          onSelectStoreButtonClick={this.handleSelectStoreButtonClick}
          onCollectionTimeChange={this.handleCollectionTimeChange}
        />
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
    if(this.props.listOfStores) {
      return (
        <List className={ClassNameUtil.getComponentClassNames(this)}>
          { this.props.listOfStores.map((store, index) => {
            return this._getStoreResultListItemContent(store, index);
          })}
        </List>
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

StoreResultsList.propTypes = {
  classNames: PropTypes.array,
  listOfStores: PropTypes.array.isRequired,
  closestFalabellaStoreText: PropTypes.string.isRequired,
  mapAndOpeningHoursText: PropTypes.string.isRequired,
  newDriveThruText: PropTypes.string.isRequired,
  weHaveADriveThruText: PropTypes.string.isRequired,
  seeMoreText: PropTypes.string.isRequired,
  onMapAndOpeningHoursLinkClick: PropTypes.func,
  onSelectStoreButtonClick: PropTypes.func,
  onCollectionTimeChange: PropTypes.func
}

/**
 * Default Props
 * @define any default props:
 *
 */

StoreResultsList.defaultProps = {
  defaultClassName: 'fbra_locationResultsList fbra_test_locationResultsList',
  className: '',
  classNames: []
}
