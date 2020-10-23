/** 
 * Navigation related helper functions.
 * 
 * @class regesta.regestalibrary.helper.NavigationHelper
 * @memberof regesta.regestalibrary.helper
 * @hideconstructor
 */

sap.ui.define([
	"regesta/regestalibrary/enum/NavigationDirection",
	"regesta/regestalibrary/helper/JsHelper",
	"regesta/regestalibrary/helper/UiHelper",
	"sap/ui/generic/app/navigation/service/NavigationHandler"
], function (NavigationDirection, JsHelper, UiHelper, NavigationHandler) {
	"use strict";

	return {
		/**
		 * Attaches an handler to a route's matched/patternMatched event.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context					The context of the router.
		 * @param	{function}						callback				The function to execute.
		 * @param	{string}						route					The name of the route to which attach the matched / patternMatched handler.
		 * @param	{boolean}						[checkPattern]=false	Defines whether to check or not the pattern. If true the callback will be attached to router's routePatternMatched/route's patternMatched event, otherwise to router's routeMatched/route's matched event.
		 */
		afterNavigation: function (context, callback, routeName, checkPattern) {
			JsHelper.checkParameters("afterNavigation", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "callback",
				value: callback,
				expected: ["function"]
			}]);

			checkPattern = checkPattern || checkPattern === true;

			var router = this.getRouter(context);

			if (routeName) {
				var route = router.getRoute(routeName);

				if (checkPattern) {
					route.attachPatternMatched(callback);
				} else {
					route.attachMatched(callback);
				}
			} else {
				if (checkPattern) {
					router.attachRoutePatternMatched(callback);
				} else {
					router.attachRouteMatched(callback);
				}
			}
		},
		/**
		 * Returns the application router.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context		The context of the router.
		 * 
		 * @returns	{sap.ui.core.routing.Router}				The router.
		 */
		getRouter: function (context) {
			JsHelper.checkParameters("getRouter", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}]);

			var router = context.getOwnerComponent().getRouter();

			return router;
		},
		/** 
		 * Executes a router navigation.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	contex							The context of the router.
		 * @param	{string}						route							The route to which navigate.
		 * @param	{object}						[options]
		 * @param	{object}						options.parameters				An object of key/value parameters to carry durig the navigation.
		 * @param	{boolean}						options.beforeNavigateCallback	A callback to be executed before navigation.
		 *																			It can allow or discard navigation by calling resolve or reject functions passed as parameters.
		 */
		navigate: function (context, routeName, options) {
			JsHelper.checkParameters("navigate", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "routeName",
				value: routeName,
				expected: ["string"]
			}]);

			options = options || {};

			var router = this.getRouter(context);

			if (!router._bIsInitialized) {
				router.initialize();
			}

			for (var key in options.parameters) {
				if (!!options.parameters[key]) { // eslint-disable-line no-extra-boolean-cast
					options.parameters[key] = encodeURIComponent(options.parameters[key]);
				}
			}

			new Promise(function (resolve, reject) {
					if (options.beforeNavigateCallback) {
						options.beforeNavigateCallback(resolve, reject);
					} else {
						resolve();
					}
				})
				.then(function () {
					router.navTo(routeName, options.parameters);
				});
		},
		/** 
		 * Executes an external (intent based) navigation.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{string}						semanticObject					Semantic object of the target app.
		 * @param	{string}						action							Action of the target app.
		 * @param	[options]
		 * @param	{object}						options.parameters				An object of key/value parameters to carry durig the navigation.
		 * @param	{function}						options.beforeNavigateCallback	A callback to be executed before navigation. It can allow or discard navigation by calling resolve or reject functions passed as parameters.
		 */
		navigateExternal: function (semanticObject, action, options) {
			JsHelper.checkParameters("navigateExternal", [{
				name: "semanticObject",
				value: semanticObject,
				expected: ["string"]
			}, {
				name: "action",
				value: action,
				expected: ["string"]
			}]);

			var crossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (crossAppNavigator && crossAppNavigator.hrefForExternal({
				target: {
					semanticObject: semanticObject,
					action: action
				},
				params: options.parameters
			}));

			options = options || {};

			new Promise(function (resolve, reject) {
					if (options.beforeNavigateCallback) {
						options.beforeNavigateCallback(resolve, reject);
					} else {
						resolve();
					}
				})
				.then(function () {
					crossAppNavigator.toExternal({
						target: {
							shellHash: hash
						}
					});
				});
		},
		/** 
		 * Executes a router navigation basing on a navigation hierarchy. The hierarchy is an array of navigation routes, note that the route names must coincide with view names.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context							The context of the router.
		 * @param	{array}							hierarchy						A collection of routes, sorted as the navigation sequence.
		 * @param	{object}						[options]					
		 * @param	{string}						options.direction=Forward		The direction {@link NavigationDirection} of the navigation.
		 * @param	{object}						options.parameters				An object of key/value parameters to carry durig the navigation.
		 * @param	{boolean}						options.cycle=false				A boolean defining if the navigation have to cycle between the hierarchy (e.g. last route will navigate to first route)
		 * @param	{function}						options.beforeNavigateCallback	A callback to be executed before navigation. It can allow or discard navigation by calling resolve or reject functions passed as parameters. It can also override navigationHierarchy by resolving with the name of a route.
		 */
		navigateHierarchy: function (context, hierarchy, options) {
			JsHelper.checkParameters("navToHierarchy", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "hierarchy",
				value: hierarchy,
				expected: ["array"]
			}]);

			options = options || {};
			options.cycle = options.cycle || options.cycle === false;
			options.direction = options.direction || NavigationDirection.Forward;

			var routeIndex = hierarchy.indexOf(UiHelper.getViewName(context));

			switch (options.direction) {
			case NavigationDirection.First:
				routeIndex = 0;
				break;
			case NavigationDirection.Last:
				routeIndex = hierarchy.length - 1;
				break;
			case NavigationDirection.Forward:
				routeIndex += 1;
				break;
			case NavigationDirection.Back:
				routeIndex -= 1;
				break;
			}

			if (options.cycle) {
				if (routeIndex < 0) {
					routeIndex = hierarchy.length - 1;
				}
				if (routeIndex >= hierarchy.length) {
					routeIndex = 0;
				}
			}

			var routeName = hierarchy[routeIndex];

			if (routeName || options.beforeNavigateCallback) {
				new Promise(function (resolve, reject) {
						if (options.beforeNavigateCallback) {
							options.beforeNavigateCallback(resolve, reject, options.direction);
						} else {
							resolve();
						}
					})
					.then(function (routeOverride) {
						this.navigate(context, routeOverride || routeName, {
							parameters: options.parameters
						});
					}.bind(this));
			}
		},
		/**
		 * Executes an external navigation to the launchpad.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{function}	[beforeNavigateCallback]	A callback to be executed before navigation.
		 */
		navigateToLaunchpad: function (beforeNavigateCallback) {
			var crossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			new Promise(function (resolve, reject) {
					if (beforeNavigateCallback) {
						beforeNavigateCallback(resolve, reject);
					} else {
						resolve();
					}
				})
				.then(function () {
					crossAppNavigator.toExternal({
						target: {
							semanticObject: "#"
						}
					});
				}.bind(this));
		},
		/**
		 * Overrides shell's back button behavior, executing given function instead of default browser-back behavior.
		 * service "ShellUIService" must be loaded, in manifest add "ShellUIService": {"factoryName": "sap.ushell.ui5service.ShellUIService"} under sap.ui5{services: []} node.
		 * 
		 * @memberof regesta.regestalibrary.helper.NavigationHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context				The context of the router.
		 * @param	{function}						navigationFunction	The navigation function to be executed at shell's back button pression.
		 */
		overrideShellBack: function (context, navigationFunction) {
			JsHelper.checkParameters("overrideShellBack", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "navigationFunction",
				value: navigationFunction,
				expected: ["function"]
			}]);

			context.getOwnerComponent().getService("ShellUIService")
				.then(function (shellService) {
					shellService.setBackNavigation(navigationFunction);
				}.bind(this));
		}
	};
});