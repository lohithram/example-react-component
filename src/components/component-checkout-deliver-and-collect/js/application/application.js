/*****************************************
 * React component application script file
 * Constructs the application
 *****************************************/

import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DebugUtil, UrlUtil, ComponentUtil, ClassNameUtil, AbstractComponentContainer } from "./class-library";
import ComponentActions from './actions/deliver-and-collect-component-actions';
import AppContainer from './react-components/app-container.jsx';
/**
 * React Component
 * This is the default React component
 * Add all your component functionality into this class
 * Feel free to create child components if required but please place them into separate files within a /react-components directory
 */
class ApplicationComponent extends Component {
  componentWillMount() {
    DebugUtil.log("Component did mount:", this.props.initialState);
    this.setState({});
    ComponentUtil.getComponentInitialState(this.props.initialState, this.props.initialStateAPI, (initialState) => {
      DebugUtil.log("Setting component state:", initialState);
      this.setState(initialState);
    });
  }

  render() {
    DebugUtil.log("Rendering component", this.props.componentType, "with props", this.props, "and state", this.state);
    return (
      <div className={ClassNameUtil.getClassNames(["fbra_falabellaComponent", "fbra_falabellaComponentCheckoutDeliverAndCollect"])}>
        <AppContainer {...this.props} />
      </div>
    );
  }
}

/**
 * Application class
 * This is the component wrapper for your React component
 * THe main container file for your component
 */
export default class Application extends AbstractComponentContainer {
  constructor(application, config) {
    super(application, config);

    // receive configuration
    ComponentActions.receiveComponentConfig(config);

    // Render the React component
    this.renderComponent(ApplicationComponent);
  }
}
