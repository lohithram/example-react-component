/*****************************************
 * React component main script file
 * The Javascript application is intiated here.
 * All API methods are exposed here.
 *****************************************/

import Application from "./application/application";

if (window["FalabellaReactApplication"]) {
	if (!window.FalabellaReactApplication["ComponentCheckoutDeliverAndCollect"]) {
		window.FalabellaReactApplication.ComponentCheckoutDeliverAndCollect = function(config) {
			var application = new Application(window.FalabellaReactApplication, config);
			return application;
		};
	}
}
else {
	// Fail silently
}
