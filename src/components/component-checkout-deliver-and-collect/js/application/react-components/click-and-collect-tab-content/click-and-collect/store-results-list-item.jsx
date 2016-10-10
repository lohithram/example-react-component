import { Component, PropTypes } from 'react';
import {
  DebugUtil, 
  ComponentUtil, 
  ObjectUtil, 
  ClassNameUtil, 
  FormUtil, 
  InlineNotification,
  ListItem, 
  Section, 
  Heading, 
  Paragraph, 
  Text, 
  Image, 
  Anchor, 
  Button,
  FieldTypes,
  MarkdownUtil
} from "../../../class-library";
import LocationResultsFilters from '../../../constants/location-results-filters';

export default class StoreResultsListItem extends Component {

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

  _handleMapAndOpeningHoursLinkClick(event) {
    event.preventDefault();
    const { store } = this.props;
    this.props.onMapAndOpeningHoursLinkClick(store.storeId);
  }

  _handleCollectionTimeChange(event) {
    event.preventDefault();
    const { store } = this.props;
    this.props.onCollectionTimeChange(store.storeId, event.target.value);
  }

  _handleSelectStoreButtonClick() {
    const { store } = this.props;
  	this.props.onSelectStoreButtonClick(store.storeId);
  }

  /**
   * Content Handling
   * @Add all getContent methods below:
   *
   */

  _getClosestFalabellaStoreContent() {
    if(this.props.isClosest) {
      return (
        <Paragraph className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__closestFalabellaStore", "fbra_test_locationResultsListItem__closestFalabellaStore"])}>
          { this.props.closestFalabellaStoreText }
        </Paragraph>
      );
    }
    return null;
  }

  _getStoreIconContent() {
    const { store } = this.props;
    if(store && store.icon && store.icon.file) {
      return (
        <Image src={store.icon.file} className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__storeIcon", "fbra_test_locationResultsListItem__storeIcon"])} />
      );
    }
  }

  _getStoreDetailsContent() {
    const { store } = this.props;
    if(store && store.name && store.distance && store.address && store.storeCity) {
      return (
        <Section className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__storeDetails", "fbra_test_locationResultsListItem__storeDetails"])}>
          <Heading className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__storeName", "fbra_test_locationResultsListItem__storeName"])}>
            { store.name }
          </Heading>
          <Paragraph className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__distanceToStore", "fbra_test_locationResultsListItem__distanceToStore"])}>
            { store.distance }
          </Paragraph>
          <Paragraph className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__addressWrap", "fbra_test_locationResultsListItem__addressWrap"])}>
            <Text className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__addressWrap__address", "fbra_test_locationResultsListItem__addressWrap__address"])}>
              { store.address }
            </Text>
            <Text className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__addressWrap__storeCity", "fbra_test_locationResultsListItem__addressWrap__storeCity"])}>
              { store.storeCity }
            </Text>
          </Paragraph>
          <Paragraph className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__mapAndOpeningHours", "fbra_test_locationResultsListItem__mapAndOpeningHours"])}>
            <Anchor className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__mapAndOpeningHours__link", "fbra_test_locationResultsListItem__mapAndOpeningHours__link"])} onClick={this.handleMapAndOpeningHoursLinkClick}>
              { this.props.mapAndOpeningHoursText }
            </Anchor>
          </Paragraph>
        </Section>
      );
    }
  }

  _getOpeningHoursContent() {
    return (
      <p
        className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__mapAndOpeningHours", "fbra_test_locationResultsListItem__mapAndOpeningHours"])}
        dangerouslySetInnerHTML={{__html: MarkdownUtil.render(this.props.store.openHours)}}
      />
    );
  }

  _getCollectFromContent() {
    const { store, collectFrom } = this.props;
    if(store && store.collectFrom) {

      const collectFromFields = store.collectFrom.map((field, index) => {
        if (field.fieldOptions && field.fieldOptions.length === 1) {
          return (
            <Paragraph key={index} className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__collectFrom", "fbra_test_locationResultsListItem__collectFrom"])}>
              {field.label} {field.fieldOptions[0].label}
            </Paragraph>
          );
        }else{
          let keyedField;
          keyedField = ObjectUtil.assoc('key', index, field);
          if (field.fieldType == FieldTypes.BUTTON) {
            keyedField = ObjectUtil.assoc('className', 'fbra_locationResultsListItem__selectButton', keyedField);
          }

          return FormUtil.getFormElement(
            keyedField,
            { onChange: this.handleCollectionTimeChange, onClick: this.handleSelectStoreButtonClick },
          );
        }
      });

      return (
        <div className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__collectFromDetails"])}>
          {collectFromFields}
        </div>
      );
    }
    return null;
  }

  _getDriveThruContent() {
    const { store, newDriveThruText, weHaveADriveThruText, seeMoreText } = this.props;
    if(store && store.hasDriveThru) {
      return (
        <Section className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__driveThru", "fbra_test_locationResultsListItem__driveThru"])}>
          <Heading className={ClassNameUtil.getClassNames(["fbra_locationResultsListItem__driveThru__newDriveThru", "fbra_test_locationResultsListItem__driveThru__newDriveThru"])}>
            {newDriveThruText }
          </Heading>
          <InlineNotification message={weHaveADriveThruText + seeMoreText}/>
        </Section>
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
    if(this.props.store) {

      let classNames = ["fbra_locationResultsListItem", "fbra_test_locationResultsListItem"];
      if(this.props.isClosest) classNames.concat(["fbra_locationResultsListItem__closestFalabellaStore--isClosest", "fbra_test_locationResultsListItem--isClosest"]);

      const storeDetailsContent = this._getStoreDetailsContent();
      const collectFromContent = this._getCollectFromContent();
      const driveThruContent = this._getDriveThruContent();

      if (this.props.activeView === LocationResultsFilters.MAP_VIEW) {
        const openingHoursContent = this._getOpeningHoursContent();
        return (
          <ListItem className={ClassNameUtil.getClassNames(classNames)}>
            { storeDetailsContent }
            { driveThruContent }
            { openingHoursContent }
            { collectFromContent }
          </ListItem>
        );
      }

      const closestFalabellaStoreContent = this._getClosestFalabellaStoreContent();
      const storeIconContent = this._getStoreIconContent();

      return (
        <ListItem className={ClassNameUtil.getClassNames(classNames)}>
          { closestFalabellaStoreContent }
          { storeIconContent }
          { storeDetailsContent }
          { collectFromContent }
          { driveThruContent }
        </ListItem>
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

StoreResultsListItem.propTypes = {
  activeView: PropTypes.number,
  classNames: PropTypes.array,
  store: PropTypes.shape({
    icon: PropTypes.shape({
      type: PropTypes.number,
      file: PropTypes.string
    }),
    name: PropTypes.string,
    distance: PropTypes.string,
    address: PropTypes.string,
    storeCity: PropTypes.string,
    openHours: PropTypes.string,
    hasDriveThru: PropTypes.bool,
    collectFrom: PropTypes.array
  }).isRequired,
  collectFrom: PropTypes.string,
  closestFalabellaStoreText: PropTypes.string,
  mapAndOpeningHoursText: PropTypes.string,
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

StoreResultsListItem.defaultProps = {
  activeView: 0,
  defaultClassName: 'fbra_locationResultsListItem fbra_test_locationResultsListItem',
  className: '',
  classNames: [],
  onMapAndOpeningHoursLinkClick: () => {},
  onSelectStoreButtonClick: () => {},
  onCollectionTimeChange: () => {}
}
