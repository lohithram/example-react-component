import { Component, PropTypes } from 'react';
import {Heading, Anchor, ClassNameUtil} from '../class-library.js'

export default class DeliveryGroupHeader extends Component{

  constructor(props){
    super(props);
  }

  onClickHandler(deliveryGroupId, event){
    event.preventDefault();
    this.props.deleteLinkHandler(deliveryGroupId, event);
  }

  render(){
    return(
      <div className={ClassNameUtil.getComponentClassNames(this)}>
        <Anchor className={ClassNameUtil.getClassNames('fbra_deliveryGroupHeader__deleteLink', 'fbra_test_deliveryGroupHeader__deleteLink')} onClick={this.onClickHandler.bind(this, this.props.deliveryGroupId)}>{this.props.removeText}</Anchor>
        <Heading className={ClassNameUtil.getClassNames('fbra_deliveryGroupHeader__heading', 'fbra_test_deliveryGroupHeader__heading')} level={2}>{this.props.heading}</Heading>
        {this.props.children}
      </div>
    );
  }
}
DeliveryGroupHeader.propTypes = {
  removeText: PropTypes.string,
  deleteLinkHandler: PropTypes.func,
  deliveryGroupId: PropTypes.string
};

DeliveryGroupHeader.defaultProps = {
  defaultClassName: 'fbra_deliveryGroupHeader fbra_test_deliveryGroupHeader',
  className: "",
  classNames: [],
  deleteLinkHandler: () => {},
  removeText: ""
}
