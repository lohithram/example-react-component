import { Component, PropTypes } from 'react';
import {
  DebugUtil,
  ComponentUtil,
  ClassNameUtil,
  FormUtil,
  GoogleMap,
  GoogleMapMarker,
  Section,
  Paragraph,
  Text,
  Anchor,
  InlineNotification,
  List,
  ListItem,
  Heading,
  FieldTypes,
  MarkdownUtil
} from "../../../class-library";

export default class StoreSummary extends Component {

  /**
   * Component Lifestyle
   * @Run through the component lifestyle; constructing, mounting, etc:
   *
   */

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
    this.handleEditAreaLinkClick = this._handleEditAreaLinkClick.bind(this);
    this.handleSeeMoreLinkClick = this._handleSeeMoreLinkClick.bind(this);
    this.handleCollectionTimeChange = this._handleCollectionTimeChange.bind(this);
  }

  _handleEditAreaLinkClick(event) {
    event.preventDefault();
    this.props.onEditAreaClick();
  }

  _handleSeeMoreLinkClick(event) {
    event.preventDefault();
    this.props.onSeeMoreClick();
  }

  _handleCollectionTimeChange(event) {
    event.preventDefault();
    const { store } = this.props;
    this.props.onCollectionTimeChange(store.storeId, event.target.value);
  }

  /**
   * Content Handling
   * @Add all getContent methods below:
   *
   */

  _getStoreDetailsContent() {
    DebugUtil.log('_getStoreDetailsContent', this.props.store);
    if(this.props.store.name && this.props.store.distance
      && this.props.store.address && this.props.store.storeCity) {
      return (
        <Section className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails", "fbra_test_locationSummary__storeDetails"])}>
          <Paragraph className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails__name", "fbra_test_locationSummary__storeDetails__name"])}>
            { this.props.store.name }
          </Paragraph>
          <Paragraph className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails__distance", "fbra_test_locationSummary__storeDetails__distance"])}>
            { this.props.store.distance }
          </Paragraph>
          <Paragraph className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails__address", "fbra_test_locationSummary__storeDetails__address"])}>
            <Text className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails__address__storeAddress", "fbra_test_locationSummary__storeDetails__address__storeAddress"])}>
              { this.props.store.address }
            </Text>
            <Text className={ ClassNameUtil.getClassNames(["fbra_locationSummary__storeDetails__address__storeCity", "fbra_test_locationSummary__storeDetails__address__storeCity"])}>
              { this.props.store.storeCity }
            </Text>
          </Paragraph>
        </Section>
      );
    }
    return null;
  }

  _getGoogleMapContent() {
    DebugUtil.log('_getGoogleMapContent', this.props.store);
    if(this.props.store.mapUri && this.props.store.longitude && this.props.store.latitude) {
      return (
        <GoogleMap
          id={this.props.store.storeId}
          className={ ClassNameUtil.getClassNames(["fbra_locationSummary__googleMap", "fbra_test_locationSummary__googleMap"])}
          defaultZoom={10}>
          <GoogleMapMarker latLng={{lat: this.props.store.latitude, lng: this.props.store.longitude}} />
        </GoogleMap>
      );
    }
    return null;
  }

  _getEditAreaLinkContent() {
    DebugUtil.log('_getEditAreaLinkContent', this.props.store);
    return (
      <Anchor className={ ClassNameUtil.getClassNames(["fbra_locationSummary__editAreaLink", "fbra_test_locationSummary__editAreaLink"])} onClick={this.handleEditAreaLinkClick}>
        { this.props.editText }
      </Anchor>
    );
  }

  _getCollectFromContent() {
    const { store } = this.props;
    if(store && store.collectFrom) {

      return store.collectFrom.map(field => {
        if (field.fieldOptions && field.fieldOptions.length === 1) {
          return (
            <Paragraph className={ClassNameUtil.getClassNames(["fbra_locationSummary__collectFrom", "fbra_test_locationSummary__collectFrom"])}>
              {field.label} {field.fieldOptions[0].label}
            </Paragraph>
          );
        }

        if (field.fieldType === FieldTypes.BUTTON) {
          return null; // we don't show the select button when the store is selected
        }

        return FormUtil.getFormElement(field, { onChange: this.handleCollectionTimeChange });
      });
    }

    return null;
  }

  _getDriveThruContent() {
    const { newDriveThruText, weHaveADriveThruText, seeMoreText } = this.props;
    if(this.props.store.hasDriveThru) {
      return (
        <Section className={ ClassNameUtil.getClassNames(["fbra_locationSummary__driveThru", "fbra_test_locationSummary__driveThru"])}>
          <Paragraph className={ ClassNameUtil.getClassNames(["fbra_locationSummary__driveThru__newDriveThru", "fbra_test_locationSummary__driveThru__newDriveThru"])}>
            { newDriveThruText }
          </Paragraph>
          <InlineNotification message={weHaveADriveThruText + seeMoreText}/>
        </Section>
      );
    }
    return null;
  }

  _getOpeningHoursContent() {
    DebugUtil.log('_getOpeningHoursContent', this.props.store, this.props.openingHoursText);
    if(this.props.store.openHours) {
      return (
        <Section className={ ClassNameUtil.getClassNames(["fbra_locationSummary__openingHours", "fbra_test_locationSummary__openingHours"])}>
          <Heading className={ ClassNameUtil.getClassNames(["fbra_locationSummary__openingHours__heading", "fbra_test_locationSummary__openingHours__heading"])}>
            { this.props.openingHoursText }
          </Heading>
          <div className={ ClassNameUtil.getClassNames(["fbra_locationSummary__openingHours__text", "fbra_test_locationSummary__openingHours__text"])}
               dangerouslySetInnerHTML={{__html: MarkdownUtil.render(this.props.store.openHours)}}
               />
        </Section>
      );
    }
  }

  /**
   * Render Method
   * @Render Component:
   *
   */

  render() {
    const storeDetailsContent = this._getStoreDetailsContent();
    const googleMapContent = this._getGoogleMapContent();
    const editAreaLinkContent = this._getEditAreaLinkContent();
    const collectFromContent = this._getCollectFromContent();
    const driveThruContent = this._getDriveThruContent();
    const openingHoursContent = this._getOpeningHoursContent();

    if(this.props.store && storeDetailsContent && googleMapContent && editAreaLinkContent
      && collectFromContent && openingHoursContent) {
      return (
        <Section className={ ClassNameUtil.getComponentClassNames(this)}>
          { editAreaLinkContent }
          { storeDetailsContent }
          { openingHoursContent }
          { collectFromContent }
          { driveThruContent }
          { googleMapContent }
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

StoreSummary.propTypes = {
  classNames: PropTypes.array,
  store: PropTypes.shape({
    mapUri: PropTypes.string,
    name: PropTypes.string,
    distance: PropTypes.string,
    address: PropTypes.string,
    storeCity: PropTypes.string,
    openHours: PropTypes.string,
    longitude: PropTypes.string,
    latitude: PropTypes.string,
    hasDriveThru: PropTypes.bool,
    collectFrom: PropTypes.array
  }),
  editText: PropTypes.string,
  newDriveThruText: PropTypes.string,
  weHaveADriveThruText: PropTypes.string,
  openingHoursText: PropTypes.string,
  seeMoreText: PropTypes.string,
  onEditAreaClick: PropTypes.func,
  onSeeMoreClick: PropTypes.func,
  onCollectionTimeChange: PropTypes.func
}

/**
 * Default Props
 * @define any default props:
 *
 */

StoreSummary.defaultProps = {
  defaultClassName: 'fbra_locationSummary fbra_test_locationSummary',
  store: {},
  className: '',
  classNames: [],
  onEditAreaClick: () => {},
  onSeeMoreClick: () => {}
}
