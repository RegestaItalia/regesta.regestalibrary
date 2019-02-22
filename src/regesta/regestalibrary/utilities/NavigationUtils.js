sap.ui.define(["regesta/regestalibrary/utilities/BindingUtils"], function (BindingUtils) {
	"use strict";
	var NavigationUtils = {};

	NavigationUtils.bindAfterNavigate = function (callback, route, checkPattern) {
		BindingUtils.checkParameters("afterNavigate", [{
			name: "callback",
			value: callback
		}]);

		var pattern = checkPattern || checkPattern !== false;
		var router = context.getOwnerComponent().getRouter();

		if (route) {
			if (pattern) {
				router.getRoute(route).attachPatternMatched(callback);
			} else {
				router.getRoute(route).attachMatched(callback);
			}
		} else {
			if (pattern) {
				router.attachRoutePatternMatched(callback);
			} else {
				router.attachRouteMatched(callback);
			}
		}
	};

	NavigationUtils.navigate = function (router, route, parameters) {
		BindingUtils.checkParameters("navigate", [{
			name: "router",
			value: router
		}, {
			name: "route",
			value: route
		}]);

		if (!router._bIsInitialized) {
			router.initialize();
		}

		router.navTo(route, parameters);
	};

	return NavigationUtils;
});