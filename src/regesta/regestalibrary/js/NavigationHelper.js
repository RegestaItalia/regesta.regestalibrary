sap.ui.define([
	"regesta/regestalibrary/enum/NavigationDirection",
	"regesta/regestalibrary/js/JsHelper",
	"regesta/regestalibrary/js/UiHelper",
	"sap/ui/generic/app/navigation/service/NavigationHandler"
], function (NavigationDirection, JsHelper, UiHelper, NavigationHandler) {
	"use strict";

	return {
		/**
		 * Attaches a function to router's routeMatched/routePatternMatched or route's matched/patternMatched event.
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context					The context of the router.
		 * @param	{string}						route					The name of the route to which attach the matched / patternMatched handler.
		 * @param	{function}						callback				The function to execute.
		 * @param	{boolean}						[checkPattern]=false	Defines whether to check or not the pattern. If true the callback will be attached to router's routePatternMatched/route's patternMatched event, otherwise to router's routeMatched/route's matched event.
		 */
		afterNavigation: function (context, routeName, callback, checkPattern) {
			JsHelper.checkParameters("afterNavigation", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "routeName",
				value: routeName,
				expected: ["string"]
			}, {
				name: "callback",
				value: callback,
				expected: ["function"]
			}]);

			checkPattern = checkPattern || checkPattern === true;

			var router = this.getRouter(context);
			var route = router.getRoute(routeName);

			if (checkPattern) {
				route.attachPatternMatched(callback);
			} else {
				route.attachMatched(callback);
			}
		},
		/**
		 * Returns the application router.
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
		 * @param	{sap.ui.core.mvc.Controller}	context				The context of the router.
		 * @param	{string}						semanticObject		Semantic object of the target app.
		 * @param	{string}						action				Action of the target app.
		 * @param	{object}						[parameters]		An object of key/value parameters to carry durig the navigation.
		 */
		navigateExternal: function (semanticObject, action, parameters) {
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
				params: parameters
			}));

			crossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			});
		},
		/** 
		 * Executes a router navigation basing on a navigation hierarchy. The hierarchy is an array of navigation routes, note that the route names must coincide with view names.
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context					The context of the router.
		 * @param	{array}							hierarchy				A collection of routes, sorted as the navigation sequence.
		 * @param	{object}						[options]					
		 * @param	{string}						options.direction=Forward		The direction {@link NavigationDirection} of the navigation.
		 * @param	{object}						options.parameters				An object of key/value parameters to carry durig the navigation.
		 * @param	{boolean}						options.cycle=true				A boolean defining if the navigation have to cycle between the hierarchy (e.g. last route will navigate to first route)
		 * @param	{boolean}						options.beforeNavigateCallback	A callback to be executed before navigation.
		 *																			It can allow or discard navigation by calling resolve or reject functions passed as parameters.
		 *																			It also can override nacigationHierarchy by resolving with the name of a route.
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
			options.cycle = options.cycle || options.cycle !== false;
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
		 */
		navigateToLaunchpad: function () {
			var crossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			crossAppNavigator.toExternal({
				target: {
					semanticObject: "#"
				}
			});
		},
		/**
		 * Overrides shell's back button behavior, making it navigate through a navigation hierarchy.
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context					The context for the router.
		 * @param	{array}							hierarchy				A collection of routes, sorted as the navigation sequence.
		 * @paran	{boolean}						[backToLaunchpad]=true	A boolean defining whether the back button should exit the app when pressed within the first route
		 */
		overrideShellBack: function (context, hierarchy, backToLaunchpad) {
			JsHelper.checkParameters("navToHierarchy", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}, {
				name: "hierarchy",
				value: hierarchy,
				expected: ["array"]
			}]);

			backToLaunchpad = backToLaunchpad || backToLaunchpad !== false;

			context.getOwnerComponent().getService("ShellUIService")
				.then(function (shellService) {
					shellService.setBackNavigation(function () {
						var routeIndex = hierarchy.indexOf(UiHelper.getViewName(context));

						if (routeIndex === 0 && backToLaunchpad) {
							this.navigateToLaunchpad();
						} else {
							this.navigateHierarchy(context, hierarchy, {
								direction: NavigationDirection.Back,
								cycle: false
							});
						}
					}.bind(this));
				}.bind(this));
		}
	};
});