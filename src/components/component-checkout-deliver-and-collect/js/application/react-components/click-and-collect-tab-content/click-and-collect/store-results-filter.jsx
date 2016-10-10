import React, { Component, PropTypes } from 'react';
import { Input, Button, ClassNameUtil, StringUtil, FormUtil } from '../../../class-library';
import LocationResultsFilters from '../../../constants/location-results-filters';

export default class StoreResultsFilter extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
  }

  bindHandlers() {
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleViewFilterChange = this._handleViewFilterChange.bind(this);
  }

  /**
  * Handles Filter change click event
  */
  _handleFilterChange(evt) {
    evt.preventDefault();
    this.props.onFilterChange(parseInt(evt.target.name));
  }

  /**
  * Handles View change click event
  */
  _handleViewFilterChange(viewType) {
    this.props.onViewFilterChange(viewType);
  }

  /**
  * Renders the search results summary
  * @returns {component}
  */
  renderSummaryContent() {
    const { foundLocationsForText, resultCount, searchedText } = this.props;
    if (!searchedText) {
      return null;
    }

    return (
      <p className={ClassNameUtil.getClassNames(['fbra_resultsFilter__summary', 'fbra_test_resultsFilter__summary'])}>{StringUtil.injectMap(foundLocationsForText, { 1: resultCount, 2: searchedText })}</p>
    );
  }

  /**
  * Renders filters
  * @returns {component}
  */
  renderFilters() {
    const { locationSearchFilter, activeFilter } = this.props;
    const classNames = ClassNameUtil.getClassNames(['fbra_resultsFilter__filters', 'fbra_test_resultsFilter__filters'])
      .concat(activeFilter === LocationResultsFilters.All_LOCATIONS ? ' fbra_resultsFilter__filters__allLocations--selected fbra_test_resultsFilter__filters__allLocations--selected' : ' fbra_resultsFilter__filters__falabellaStores--selected fbra_test_resultsFilter__filters__falabellaStores--selected');
    return (
      <div className={classNames}>
        {FormUtil.getFormElement(locationSearchFilter, { onClick: this._handleFilterChange })}
      </div>
    )
  }

  /**
  * Renders view filter buttons
  * @returns {component}
  */
  renderViewFilters() {
    const { activeView, listViewText, mapViewText } = this.props;
    return (
      <ul className={ClassNameUtil.getClassNames(['fbra_resultsFilter__viewFilters', 'fbra_test_resultsFilter__viewFilters'])}>
        <li>
          <Button
            title={listViewText}
            onClick={() => this._handleViewFilterChange(LocationResultsFilters.LIST_VIEW)}
            className={ClassNameUtil.getClassNames(['fbra_resultsFilter__viewFilters__listView', 'fbra_test_resultsFilter_viewFilters__listView'])
              .concat(activeView === LocationResultsFilters.LIST_VIEW ? ' fbra_resultsFilter__viewFilters__listView--selected fbra_test_resultsFilter_viewFilters__listView--selected' : '')}>
            {listViewText}
          </Button>
        </li>
        <li>
          <Button
            title={mapViewText}
            onClick={() => this._handleViewFilterChange(LocationResultsFilters.MAP_VIEW)}
            className={ClassNameUtil.getClassNames(['fbra_resultsFilter__viewFilters__mapView', 'fbra_test_resultsFilter_viewFilters__mapView'])
              .concat(activeView === LocationResultsFilters.MAP_VIEW ? ' fbra_resultsFilter__viewFilters__mapView--selected fbra_test_resultsFilter_viewFilters__mapView--selected' : '')}>
            {mapViewText}
          </Button>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className={ClassNameUtil.getClassNames(['fbra_resultsFilter', 'fbra_test_resultsFilter'])}>
        {this.renderSummaryContent()}
        {this.renderFilters()}
        {this.renderViewFilters()}
      </div>
    );
  }
}

StoreResultsFilter.propTypes = {
  locationSearchFilter: PropTypes.object.isRequired,
  activeFilter: PropTypes.number,
  activeView: PropTypes.number,
  resultCount: PropTypes.number.isRequired,
  searchedText: PropTypes.string.isRequired,
  foundLocationsForText: PropTypes.string.isRequired,
  listViewText: PropTypes.string.isRequired,
  mapViewText: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onViewFilterChange: PropTypes.func.isRequired
}

StoreResultsFilter.defaultProps = {
  locationSearchFilter: {},
  activeFilter: 0,
  activeView: 0,
  resultCount: 0,
  searchedText: '',
  foundLocationsForText: '',
  onFilterChange: () => {},
  onViewFilterChange: () => {}
}
