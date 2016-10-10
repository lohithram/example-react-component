import React, { Component, PropTypes } from 'react';
import {
  ClassNameUtil,
  Section, Heading, Paragraph, Text, Anchor, InlineNotification
} from "../../../class-library";

export default class AdditionalInfo extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
  }

  bindHandlers() {
    this.handleViewMoreClick = this.handleViewMoreClick.bind(this);
  }

  handleViewMoreClick(evt) {
    evt.preventDefault();
    this.props.onViewMoreClick();
  }

  renderViewMore() {
    if(!this.props.onViewMoreClick || !this.props.showViewMoreLink) {
      return null;
    }

    const { viewMoreLocationsText } = this.props;
    return (
      <Anchor className={ ClassNameUtil.getClassNames(["fbra_additionalInfo__viewMoreLink", "fbra_test_additionalInfo__viewMoreLink"])} onClick={this.handleViewMoreClick}>
        {viewMoreLocationsText}
      </Anchor>
    )
  }

  render() {
    const { onlyCollectionLocationsListedText, whereToGoWhatToBringText,
            tipsToHelpYouWhenText, collectingYourOrderText } = this.props;
    return (
      <Section className={ ClassNameUtil.getClassNames(["fbra_additionalInfo", "fbra_test_additionalInfo"])}>
        <Paragraph className={ ClassNameUtil.getClassNames(["fbra_additionalInfo__locationsListed", "fbra_test_additionalInfo__locationsListed"])}>
          {onlyCollectionLocationsListedText}
        </Paragraph>
        {this.renderViewMore()}
        <Heading className={ ClassNameUtil.getClassNames(["fbra_additionalInfo__heading", "fbra_test_additionalInfo__heading"])}>
          { whereToGoWhatToBringText }
        </Heading>
        <InlineNotification className={ ClassNameUtil.getClassNames(["fbra_additionalInfo__details", "fbra_test_additionalInfo__details"])}
                      message={ tipsToHelpYouWhenText + collectingYourOrderText }/>
      </Section>
    );
  }
}

AdditionalInfo.propTypes = {
  onlyCollectionLocationsListedText: PropTypes.string,
  whereToGoWhatToBringText: PropTypes.string.isRequired,
  tipsToHelpYouWhenText: PropTypes.string.isRequired,
  viewMoreLocationsText: PropTypes.string,
  collectingYourOrderText: PropTypes.string.isRequired,
  onViewMoreClick: PropTypes.func,
  showViewMoreLink: PropTypes.bool
}

AdditionalInfo.defaultProps = {
  onlyCollectionLocationsListedText: '',
  showViewMoreLink: false
}
