import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  DeliverAndCollectFormIdentifier as FormIdentifier,
  Heading,
  Section
} from '../../class-library';
import { StoreSummary, AdditionalInfo } from './click-and-collect';
import SelectedStoreStoreActions from '../../actions/selected-store-store-actions';
import ClickAndCollectActions from '../../actions/click-and-collect-actions';
import ReceiveDelivery from '../receive-delivery';

export default class StoreSelectedScreen extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
  }

  bindHandlers() {
    this.handleOnEditAreaClick = this.handleOnEditAreaClick.bind(this);
    this.handleOnSeeMoreClick = this.handleOnSeeMoreClick.bind(this);
    this.handleChangeWhoWillReceiveDelivery = this.handleChangeWhoWillReceiveDelivery.bind(this);
    this.handleCollectionTimeChange = this.handleCollectionTimeChange.bind(this);
  }

  handleOnEditAreaClick() {
    const { deliveryGroupId, endPoints, store: { latitude, longitude } } = this.props;
    ClickAndCollectActions.unselectAndLatLongSearchForStore(deliveryGroupId, latitude, longitude, endPoints);
  }

  handleOnSeeMoreClick() {
    // @todo: dispatch action
  }

  handleChangeWhoWillReceiveDelivery({ name, value }) {
    ClickAndCollectActions.changeWhoWillCollectFormField(
      this.props.deliveryGroupId,
      name,
      value
    );
  }

  handleCollectionTimeChange(storeId, value) {
    const { deliveryGroupId, endPoints } = this.props;
    SelectedStoreStoreActions.setSelectedStoreCollectionValue(this.props.deliveryGroupId, value);
    ClickAndCollectActions.setSelectedStore(deliveryGroupId, storeId, value, endPoints);
  }

  renderWhoWillReceiveDelivery() {
    const {
      deliveryGroupId,
      whoWillCollect: {
        whoWillCollect,
        thirdPersonFirstName,
        thirdPersonLastName,
        thirdPersonPhoneNumber,
        thirdPersonId,
        thirdPersonIdSelectorLink,
        thirdPersonIdType,
        thirdPersonIdSelectorAction
      }
    } = this.props;

    if (!whoWillCollect) return null;

    return (
      <div className="fbra_whoWillCollectThisDelivery">
        <Heading level={3}>{whoWillCollect.label}</Heading>

        <ReceiveDelivery
          whoWillCollect={whoWillCollect}
          thirdPersonFirstName={thirdPersonFirstName}
          thirdPersonLastName={thirdPersonLastName}
          thirdPersonPhoneNumber={thirdPersonPhoneNumber}
          initialThirdPersonId={thirdPersonId}
          thirdPersonIdSelectorLink={thirdPersonIdSelectorLink}
          initialThirdPersonIdType={thirdPersonIdType}
          thirdPersonIdSelectorAction={thirdPersonIdSelectorAction}
          formContext={FormIdentifier.whoWillCollect(deliveryGroupId)}
          onChange={this.handleChangeWhoWillReceiveDelivery} />
      </div>
    );
  }

  render() {
    const {
      newDriveThruText,
      weHaveADriveThruText,
      openingHoursText,
      whereToGoWhatToBringText,
      tipsToHelpYouWhenText,
      collectingYourOrderText,
      seeMoreText,
      editText
    } = this.props.textDictionary;

    return (
      <Section className={ClassNameUtil.getComponentClassNames(this)}>

        <StoreSummary
          store={this.props.store}
          editText={editText}
          newDriveThruText={newDriveThruText}
          weHaveADriveThruText={weHaveADriveThruText}
          openingHoursText={openingHoursText}
          seeMoreText={seeMoreText}
          onEditAreaClick={this.handleOnEditAreaClick}
          onSeeMoreClick={this.handleOnSeeMoreClick}
          onCollectionTimeChange={this.handleCollectionTimeChange}/>

        <AdditionalInfo
          whereToGoWhatToBringText={whereToGoWhatToBringText}
          tipsToHelpYouWhenText={tipsToHelpYouWhenText}
          collectingYourOrderText={collectingYourOrderText}/>

        {this.renderWhoWillReceiveDelivery()}
      </Section>
    )
  }
}

StoreSelectedScreen.propTypes = {
  deliveryGroupId: PropTypes.string.isRequired,
  textDictionary: PropTypes.object.isRequired,
  whoWillCollect: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  endPoints: PropTypes.object,
  className: PropTypes.string,
  classNames: PropTypes.array
}

StoreSelectedScreen.defaultProps = {
  textDictionary: {},
  whoWillCollect: {},
  defaultClassName: 'fbra_deliverAndCollect__screen fbra_deliverAndCollect__storeSelectedScreen',
  className: '',
  classNames: []
}
