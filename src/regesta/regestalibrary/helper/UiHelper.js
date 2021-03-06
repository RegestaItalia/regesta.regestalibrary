/** 
 * Ui related helper functions.
 * 
 * @class regesta.regestalibrary.helper.UiHelper
 * @memberof regesta.regestalibrary.helper
 * @hideconstructor
 */

sap.ui.define([
	"regesta/regestalibrary/enum/DialogAction",
	"regesta/regestalibrary/enum/DialogType",
	"regesta/regestalibrary/helper/JsHelper",
	"sap/m/ButtonType",
	"sap/m/Dialog",
	"sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (DialogAction, DialogType, JsHelper, ButtonType, Dialog, ValueState, Filter, FilterOperator) {
	"use strict";

	var busyCounters = [];
	var dialogTypeDefaults = {
		generic: {
			titlePath: "",
			icon: null,
			state: ValueState.None,
			actions: ["Close"],
			type: "Standard",
			resizable: true
		},
		information: {
			titlePath: "regestalibraryi18n>dialogInformation",
			icon: "sap-icon://message-information",
			state: ValueState.Information,
			actions: ["Close"],
			type: "Message",
			resizable: false
		},
		question: {
			titlePath: "regestalibraryi18n>dialogQuestion",
			icon: "sap-icon://question-mark",
			state: ValueState.None,
			actions: ["Accept", "Reject"],
			type: "Message",
			resizable: false
		},
		success: {
			titlePath: "regestalibraryi18n>dialogSuccess",
			icon: "sap-icon://message-success",
			state: ValueState.Success,
			actions: ["Close"],
			type: "Message",
			resizable: false
		},
		warning: {
			titlePath: "regestalibraryi18n>dialogWarning",
			icon: "sap-icon://message-warning",
			state: ValueState.Warning,
			actions: ["Close"],
			type: "Message",
			resizable: false
		},
		error: {
			titlePath: "regestalibraryi18n>dialogError",
			icon: "sap-icon://message-error",
			state: sap.ui.core.ValueState.Error,
			actions: ["Close"],
			type: "Message",
			resizable: false
		}
	};
	var dialogActionDefaults = {
		accept: {
			textPath: "regestalibraryi18n>dialogAccept",
			icon: "sap-icon://accept",
			type: ButtonType.Emphasized
		},
		reject: {
			textPath: "regestalibraryi18n>dialogReject",
			icon: "sap-icon://decline",
			type: ButtonType.Default
		},
		confirm: {
			textPath: "regestalibraryi18n>dialogConfirm",
			icon: "sap-icon://accept",
			type: ButtonType.Emphasized
		},
		abort: {
			textPath: "regestalibraryi18n>dialogAbort",
			icon: "sap-icon://decline",
			type: ButtonType.Default
		},
		close: {
			textPath: "regestalibraryi18n>dialogClose",
			icon: "sap-icon://inspect-down",
			type: ButtonType.Default
		}
	};
	var dialogs = {};

	return {
		/** 
		 * Enables or disables the selectability of a responsiveTable.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.m.ColumnListItem}	row 		The row to enable / disable.
		 * @param	{boolean}				[enable]	Indicates whether to enable or not the selectability of the row.
		 */
		enableRowSelection: function (row, enable) {
			JsHelper.checkParameters("enableRowSelection", [{
				name: "row",
				value: row,
				expected: ["sap.m.ColumnListItem"]
			}]);

			enable = enable || enable !== false;

			var domRow;
			var domSelectionColumn;
			var domSelector;
			var ui5Selector;

			switch (JsHelper.typeOf(row)) {
			case "sap.m.ColumnListItem":
				domRow = row.getDomRef();
				domSelectionColumn = domRow.getElementsByClassName("sapMListTblSelCol")[0];
				domSelector = domSelectionColumn.getElementsByClassName("sapMRb")[0] || domSelectionColumn.getElementsByClassName("sapMCb")[0];
				ui5Selector = this.ui5ByDomId(domSelector.id)[0];

				if (enable) {
					ui5Selector.setEnabled(true);
				} else {
					ui5Selector.setEnabled(false);
					row.setSelected(false);
				}
				break;
			case "sap.ui.table.Row":
				domRow = row.getDomRef();
				domSelectionColumn = domRow.getElementsByClassName("sapUiTableRowSelectionCell")[0];
				domSelector = domSelectionColumn.getElementsByClassName("sapMRb")[0] || domSelectionColumn.getElementsByClassName("sapMCb")[0];
				ui5Selector = this.ui5ByDomId(domSelector.id)[0];

				if (enable) {
					ui5Selector.setEnabled(true);
				} else {
					ui5Selector.setEnabled(false);
					row.setSelected(false);
				}
				break;
			}
		},
		/** 
		 * Focuses the given input, selecting all of its content.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.m.InputBase}	input	The input to focus.
		 */
		focusInput: function (input) {
			JsHelper.checkParameters("focusInput", [{
				name: "input",
				value: input,
				expected: ["sap.m.InputBase"]
			}]);

			setTimeout(function () {
				input.focus();

				if (input._$input && input._$input[0]) {
					input._$input[0].selectionStart = 0;
					input._$input[0].selectionEnd = input.getValue().length;
				}
			}, 0);
		},
		/**
		 * Returns current application's name without indication of the namespace (e.g. "appname" instead of "namespace/appname").
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller|sap.ui.core.Component}	context 	The application's component or a view's controller.
		 * 
		 * @returns {string}														The name of the application.
		 */
		getAppName: function (context) {
			JsHelper.checkParameters("getAppName", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller", "sap.ui.core.Component"]
			}]);

			context = context instanceof sap.ui.core.Component ? context : context.getOwnerComponent();

			return context.getMetadata().getName().split(".")[1];
		},
		/** 
		 * Returns current application's version.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller|sap.ui.core.Component}	context 	The application's component or a view's controller.
		 * 
		 * @returns {string}														The version of the application.
		 */
		getAppVersion: function (context) {
			JsHelper.checkParameters("getAppVersion", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller", "sap.ui.core.Component"]
			}]);

			context = context instanceof sap.ui.core.Component ? context : context.getOwnerComponent();

			return context.getManifest()["sap.app"].applicationVersion.version;
		},
		/** 
		 * Gets the content density used within the view of the provided controller.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context	The view's controller.
		 * 
		 * @returns {string}						The name of the content-density class.
		 */
		getContentDensity: function (context) {
			JsHelper.checkParameters("getContentDensity", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}]);

			if (!context._sContentDensityClass) {
				if (sap.ui.Device.support.touch) {
					context._sContentDensityClass = "sapUiSizeCozy";
				} else {
					context._sContentDensityClass = "sapUiSizeCompact";
				}
			}
			return context._sContentDensityClass;
		},
		/** 
		 * Returns the current language of the application.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @returns 	{string}	The language of the application.
		 */
		getCurrentLanguage: function () {
			return sap.ui.getCore().getConfiguration().getLanguage();
		},
		/** 
		 * Returns the value of a control's customData.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.Control}	control 	The control containing the customData.
		 * @param	{string}				key 		The key of the customData to find.
		 * 
		 * @returns {value} 							The value of the customData.
		 */
		getCustomData: function (control, key) {
			var customData = control.getCustomData();
			var searchedCustomData = customData.find(function (data) {
				return data.getKey() === key;
			});

			return searchedCustomData ? searchedCustomData.getValue() : undefined;
		},
		/**
		 * Returns a dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{string}		name	The name of the dialog.
		 *	
		 * @returns	{sap.m.Dialog}			The requested dialog.
		 */
		getDialog: function (name) {
			JsHelper.checkParameters("getDialog", [{
				name: "name",
				value: name,
				expected: ["string"]
			}]);

			var dialog = dialogs[name];

			return dialog;
		},
		/**
		 * Gets DOM elements by UI5 control's partial id.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param		{string}	partialId	The id of the element.
		 * 
		 * @returns 	{array} 				An array of dom element whose id ends with the given one.
		 */
		getElementsByPartialId: function (partialId) {
			JsHelper.checkParameters("getElementsByPartialId", [{
				name: "partialId",
				value: partialId,
				expected: ["string"]
			}]);

			var query = "[id$={0}]";
			var domElement = document.querySelectorAll(JsHelper.replaceByIndex(query, [partialId]));

			return domElement;
		},
		/**
		 * Returns the first fieldGroupId of an element.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.Element}			element 	The element of which get the fieldGroupId.
		 * 
		 * @returns {string}									The first fieldGroupId of the given element.
		 */
		getFieldGroupId: function (element) {
			JsHelper.checkParameters("fieldGroupId", [{
				name: "element",
				value: element,
				expected: ["sap.ui.core.Element"]
			}]);

			var fieldGroupId = element.getFieldGroupIds()[0];

			return fieldGroupId;
		},
		/**
		 * Returns the focused element.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.Controller}	context 	The view's controller.
		 * 
		 * @returns {sap.ui.core.Element}					Currently focused element.
		 */
		getFocusedElement: function (context) {
			JsHelper.checkParameters("getFocusedElement", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}]);

			var currentFocusedId = sap.ui.getCore().getCurrentFocusedControlId();
			var currentFocusedElement = context.byId(currentFocusedId);

			return currentFocusedElement;
		},
		/**
		 * Searches for the first input which name equal given one and returns it.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.Controller}	context 	The view's controller.
		 * @param	{string}					name		The name of the input.
		 * 
		 * @return {sap.m.InputBase}						The first input with given name.
		 */
		getInputByName: function (context, name) {
			JsHelper.checkParameters("getInputByName", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}, {
				name: "name",
				value: name,
				expected: ["string"]
			}]);

			var controls = context.getView().getControlsByFieldGroupId("");
			var input = controls.find(function (control) { // eslint-disable-line consistent-return
				if (control.getName) {
					return control.getName() === name;
				}
			});

			return input;
		},
		/**
		 * Returns the collection of inputs belonging to a fieldGroup.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context 		The view's controller.
		 * @param	{string}						fieldGroupId	The name of the fieldGroup.
		 * 
		 * @returns {sap.m.InputBase[]} 							The inputs belonging to the fieldGroup.
		 */
		getInputsByFieldGroupId: function (context, fieldGroupId) {
			JsHelper.checkParameters("inputsByFieldGroupId", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}, {
				name: "fieldGroupId",
				value: fieldGroupId,
				expected: ["string"]
			}]);

			var inputs = context.getView().getControlsByFieldGroupId(fieldGroupId).filter(function (control) {
				return control instanceof sap.m.InputBase || control instanceof sap.ui.comp.smartfield.SmartField;
			}) || [];

			return inputs;
		},
		/** 
		 * Returns the version of a specified loaded library.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{string}	name	The name of the library.
		 * 
		 * @returns {string}			The version of the specified library.
		 */
		getLibraryVersion: function (name) {
			JsHelper.checkParameters("getLibraryVersion", [{
				name: "name",
				value: name,
				expected: ["string"]
			}]);

			return sap.ui.getCore().getLoadedLibraries()[name].version;
		},
		/**
		 * Searches for inputs which have the same fieldGroupId of the given input and returns the subsequent one.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context 		The view's controller.
		 * @param	{sap.ui.core.Control}			currentField	The control of which find next one.
		 * @param	{boolean}						[cycle] = true	If true, the logic will continue cycling the fielGroup (e.g. if currentField is the last field of the fieldGroup, will be returned the first field of the input).
		 * 
		 * @returns {sap.m.InputBase}				The field subsequent to the element.
		 */
		getNextField: function (context, currentField, cycle) {
			JsHelper.checkParameters("getNextField", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}, {
				name: "currentField",
				value: currentField,
				expected: ["sap.ui.core.Control"]
			}]);

			cycle = cycle || cycle !== false;

			var fieldGroupId = this.getFieldGroupId(currentField);
			var fieldGroupInputs = this.getInputsByFieldGroupId(context, fieldGroupId);
			var nextField = fieldGroupInputs[fieldGroupInputs.indexOf(currentField) + 1];

			if (!nextField && (cycle || fieldGroupInputs.length === 1)) {
				nextField = fieldGroupInputs[0];
			}

			return nextField;
		},
		/** 
		 * Goes up the control tree to find given control's parent of specified type.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.control}	child		The inner child control.
		 * @param	{string}				targetType	The type of the parent to find.
		 * 
		 * @returns {sap.ui.core.Element}				The parent control.
		 */
		getParentOfType: function (child, targetType) {
			JsHelper.checkParameters("getParentOfType", [{
				name: "child",
				value: child,
				expected: ["sap.ui.core.Control"]
			}, {
				name: "targetType",
				value: targetType,
				expected: ["string"]
			}]);

			while (!!child && JsHelper.typeOf(child) !== targetType && child.getParent) {
				child = child.getParent();
			}

			return child || undefined;
		},
		/**
		 * Returns current application's startup parameters.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller|sap.ui.core.Component}	context 	The application's component or a view's controller.
		 * 
		 * @returns {array} 														Application's startup parameters.
		 */
		getStartupParameters: function (context) {
			JsHelper.checkParameters("getStartupParameters", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller", "sap.ui.core.Component"]
			}]);

			context = context instanceof sap.ui.core.Component ? context : context.getOwnerComponent();

			return context.getComponentData().startupParameters;
		},
		/**
		 * Returns the UI5 control corresponding to a DOM element.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{domElement}			domElement	The DOM element that's supposed to be an UI5 control.
		 * 
		 * @returns {sap.ui.core.control}				The UI5 control.
		 */
		getUi5ByDom: function (domElement) {
			JsHelper.checkParameters("getUi5ByDom", [{
				name: "domElement",
				value: domElement,
				expected: ["object"]
			}]);

			var ui5Control = domElement ? sap.ui.getCore().byId(domElement.id) : null;

			return ui5Control;
		},
		/** 
		 * Returns an object whose properties corresponds to each parameter present in the search section of the current url.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @returns 	{object}	The parameters object.
		 */
		getUrlParameters: function () {
			var keyValuePairs = location.search.substr(1).split("&");
			var parameters = {};

			keyValuePairs.forEach(function (keyValue) {
				if (!keyValue) {
					return;
				}

				var key = keyValue.split("=")[0];
				var value = keyValue.split("=")[1];

				parameters[key] = value;
			});

			return parameters;
		},
		/** 
		 * Returns a view's name without indication of the namespace (e.g. "subfolder/View" instead of "namespace/appname/view/subfolder/View").
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context 	The view's controller.
		 * 
		 * @returns {string}									The name of the given controller's view.
		 */
		getViewName: function (context) {
			JsHelper.checkParameters("viewName", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}]);

			var nameParts = [];

			nameParts = context.getView().getViewName().split(".");
			nameParts = nameParts.slice(nameParts.indexOf("view") + 1);

			return nameParts.join("/");
		},
		/**
		 * Make app go fullscreen
		 */
		goFullScreen: function () {
			var className = "sapUShellApplicationContainerLimitedWidth";
			var container = document.getElementsByClassName(className)[0]; //eslint-disable-line sap-no-dom-access

			if (container) {
				container.className = container.className.replace(className, "");
			}

			className = "sapMShellCentralBox";
			container = document.getElementsByClassName(className)[0]; //eslint-disable-line sap-no-dom-access

			if (container) {
				container.style.left = "0";
				container.style.margin = "0";
				container.style.width = "100%";
			}
		},
		/**
		 * Reloads the application to its main view.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		reload: function () {
			this.showBusy();

			location.assign(location.origin + location.pathname + location.search); // eslint-disable-line sap-no-location-usage
		},
		/** 
		 * Sets additional parameters in the search segment of the current url.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{object}	parametersToAdd	An object representation (key/value) of the paramters to be added.
		 */
		setUrlParameterss: function (parametersToAdd) {
			JsHelper.checkParameters("setUrlParameters", [{
				name: "parametersToAdd",
				value: parametersToAdd,
				expected: ["object"]
			}]);

			this.showBusy();

			onload = function () {
				this.showBusy(null, true);
			};

			var parameters = this.getUrlParams();
			var keyValuePairs = "";

			Object.keys(parametersToAdd).forEach(function (key) {
				var value = parametersToAdd[key];

				if (value) {
					parameters[key] = value;
				} else {
					delete parameters[key];
				}
			});

			Object.keys(parameters).forEach(function (key) {
				keyValuePairs += "&" + key;
				keyValuePairs += "=" + parameters[key];
			});

			location.search = keyValuePairs.substr(1); // eslint-disable-line sap-no-location-usage
		},
		/** 
		 * Sets/unsets busy states, using a counter to keep track of control's busy states (e.g. for subsequent http calls).
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{sap.ui.model.PropertyBinding}			[bindings]		An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * @param	{boolean}								[unset = false]	Defines whether to decrement busy counter.
		 * @param	{boolean}								[reset = false]	Defines whether to force unset of busyState.
		 * @param	{integer}								[delay = 0]		The delay to apply when showing sap.ui.core.BusyIndicator. For other controls use inherited sap.ui.core.Control.busyIndicatorDelay property.
		 */
		showBusy: function (bindings, unset, reset, delay) {
			bindings = bindings || []; // eslint-disable-line no-param-reassign
			unset = unset || unset === true; // eslint-disable-line no-param-reassign
			reset = reset || reset === true; // eslint-disable-line no-param-reassign
			delay = delay || 0; // eslint-disable-line no-param-reassign

			var calculateBusyCounter = function (busyCounterKey) {
				var busyCounter = busyCounters[busyCounterKey] || 0;

				busyCounter = reset ? 0 : unset ? busyCounter - 1 : busyCounter + 1; // eslint-disable-line no-nested-ternary

				return busyCounter;
			};

			if (bindings.length > 0) {
				bindings.forEach(function (binding) {
					var bindingContext = binding.getContext();
					var bindingModel = binding.getModel();
					var bindingPath = binding.getPath();

					var busyCounterKey = bindingModel.getId() + (bindingContext ? bindingContext.getPath() + "/" + bindingPath : bindingPath);
					var busyCounter = calculateBusyCounter(busyCounterKey);

					if (busyCounter === 1) {
						bindingModel.setProperty(bindingContext ? bindingContext.getPath() + "/" + bindingPath : bindingPath, true);
					} else if (busyCounter <= 0) {
						bindingModel.setProperty(bindingContext ? bindingContext.getPath() + "/" + bindingPath : bindingPath, false);
					}

					busyCounters[busyCounterKey] = busyCounter;
				}.bind(this));
			} else {
				var busyCounterKey = "core";
				var busyCounter = calculateBusyCounter(busyCounterKey);

				if (busyCounter === 1) {
					sap.ui.core.BusyIndicator.show(delay);
				}
				if (busyCounter <= 0) {
					sap.ui.core.BusyIndicator.hide();
				}

				if (reset || unset) {
					sap.ui.core.BusyIndicator.hide();
				} else {
					sap.ui.core.BusyIndicator.show(delay);
				}

				busyCounters[busyCounterKey] = busyCounter;
			}
		},
		/**
		 * Shorthand: calls showDialog to create an error dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		showErrorDialog: function (context, content, options) {
			options = options || {};
			options.type = DialogType.Error;

			var dialog = this.showDialog(context, content, options);

			return dialog;
		},
		/**
		 * Shorthand: calls showDialog to create an information dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		showInformationDialog: function (context, content, options) {
			options = options || {};
			options.type = DialogType.Information;

			var dialog = this.showDialog(context, content, options);

			return dialog;
		},
		/**
		 * Builds a sap.m.Dialog with presets.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param {sap.ui.base.managedObject|sap.ui.core.mvc.Controller} context The context for the dialog.
		 * @param {string|sap.ui.core.Control} content The content for the dialog. It could be a message, a fragment path or a sap.ui.core.Control.
		 * @param {object} [options] Additional options for the dialog.
		 * 
		 * @param {array}					options.actions=variable An array of actions ({@link DialogAction}) to be shown in the footer of the dialog (may vary depending on {@link DialogType|dialog type}).
		 * @param {boolean} 				options.autoOpen=true Defines if the dialog will be automatically opened after being built.
		 * @param {boolean} 				options.buttonIcons=false Defines whether to display button icons instead of labels.
		 * @param {boolean} 				options.closeOnEscape=true Defines if the dialog can be closed by pressing escape key.
		 * @param {boolean} 				options.closeOnOuterTap=true Defines if the dialog can be closed by clicking outside of it.
		 * @param {sap.ui.core.CSSSize} 	options.contentHeight=auto Defines the height of the content. It only has effect when options.stretch is set to false.
		 * @param {sap.ui.core.CSSSize} 	options.contentWidth=auto Defines the width of the content. It only has effect when options.stretch is set to false.
		 * @param {sap.m.IBar}				options.customHeader The custom header of the dialog.
		 * @param {boolean} 				options.draggable=true Defines whether the dialog is or not draggable.
		 * @param {function}				options.escapeCallback The callback to be executed when closing the dialog via escape Key. If present, the callback has the possibility to prevent the closing of the dialog by executing the reject function received as first parameter (second parameter is a reference to the dialog itself), otherwise the dialog will be automatically closed.
		 * @param {boolean} 				options.fragment=false Defines the height of the content. It only has effect when options.stretch = false.
		 * @param {sap.ui.core.URI} 		options.icon=variable The icon of the dialog (may vary depending on {@link DialogType|dialog type}).
		 * @param {function}				options.openCallback The callback to be executed on afterOpen dialog event..
		 * @param {function}				options.outerTapCallback The callback to be executed when closing the dialog via outerTap. If present, the callback has the possibility to prevent the closing of the dialog by executing the reject function received as first parameter (second parameter is a reference to the dialog itself), otherwise the dialog will be automatically closed.
		 * @param {boolean}					options.padding=true Defines whether the dialog should have padding or not.
		 * @param {boolean} 				options.resizable=variable Defines whether the dialog is or not resizable (may vary depending on {@link DialogType|dialog type}).
		 * @param {sap.ui.core.ValueState}	options.state=variable The state of the dialog (may vary depending on {@link DialogType|dialog type}).
		 * @param {boolean} 				options.stretch=false Defines whether the dialog is or not stretched.
		 * @param {sap.m.IBar}				options.subHeader The subHeader to be displayed under the header pf the dialog.
		 * @param {sap.ui.core.TextAlign}	options.textAlign=Center Defines the alignment of the context if options.fragment is set to false.
		 * @param {string}					options.title=variable The title of the dialog (may vary depending on {@link DialogType|dialog type}).
		 * @param {string}					options.type=Generic The tipe ({@link DialogType}) of the dialog.
		 * @param {function}				options.*name_of_action*Callback The callback to be attached an action. Note that this parameter needs to be built as the concatenation of the noun of the action with "Callback" (e.g. closeCallback). It can be specified once per action. If present, the callback has the possibility to prevent the closing of the dialog by executing the reject function received as first parameter (second parameter is a reference to the dialog itself), otherwise the dialog will be automatically closed.
		 * @param {sap.ui.core.URI} 		options.*name_of_action*Icon=variable The icon for an action (may vary depending on {@link DialogAction|action type}). Note that this parameter needs to be built as the concatenation of the noun of the action with "Icon" (e.g. closeIcon). It can be specified once per action.
		 * @param {string}					options.*name_of_action*Text=variable The label for an action (may vary depending on {@link DialogAction|action type}). Note that this parameter needs to be built as the concatenation of the noun of the action with "Text" (e.g. closeText). It can be specified once per action.
		 * @param {sap.m.ButtonType}		options.*name_of_action*Type=variable The type for an action (may vary depending on {@link DialogAction|action type}). Note that this parameter needs to be built as the concatenation of the noun of the action with "Type" (e.g. closeType). It can be specified once per action.
		 * 
		 * @returns {sap.m.Dialog} The built dialog.
		 */
		showDialog: function (context, content, options) { // eslint-disable-line complexity
			JsHelper.checkParameters("dialog", [{
				name: "context",
				value: context,
				expected: ["sap.ui.base.ManagedObject", "sap.ui.core.mvc.Controller"]
			}, {
				name: "content",
				value: content,
				expected: ["string", "sap.ui.core.Control"]
			}]);

			// initialization >>
			options = options || {};
			options.type = options.type || DialogType.Generic;
			options.draggable = options.draggable || options.draggable !== false;
			options.stretch = options.stretch || options.stretch === true;
			options.contentWidth = options.stretch ? "auto" : options.contentWidth || "auto";
			options.contentHeight = options.stretch ? "auto" : options.contentHeight || "auto";
			options.fragment = options.fragment || options.fragment === true;
			options.textAlign = options.textAlign || "Center";
			options.buttonIcons = options.buttonIcons || options.buttonIcons === true;
			options.closeOnOuterTap = options.closeOnOuterTap || options.closeOnOuterTap !== false;
			options.closeOnEscape = options.closeOnEscape || options.closeOnEscape !== false;
			options.autoOpen = options.autoOpen || options.autoOpen !== false;
			options.padding = options.padding || options.padding !== false;

			if (options.icon === undefined || options.icon === null) {
				options.icon = dialogTypeDefaults[options.type.toLowerCase()].icon;
			}
			if (options.title === undefined || options.title === null) {
				options.title = {
					path: dialogTypeDefaults[options.type.toLowerCase()].titlePath
				};
			}
			if (options.state === undefined || options.state === null) {
				options.state = dialogTypeDefaults[options.type.toLowerCase()].state;
			}
			if (options.resizable === undefined || options.resizable === null) {
				options.resizable = dialogTypeDefaults[options.type.toLowerCase()].resizable;
			}
			if (options.actions === undefined || options.actions === null) {
				options.actions = dialogTypeDefaults[options.type.toLowerCase()].actions;
			}
			// initialization <<

			var dialog = dialogs[name];

			dialog = new Dialog();

			// options >>
			dialog.setIcon(options.icon);
			if (options.title && (JsHelper.typeOf(options.title) === "string" || JsHelper.typeOf(options.title) === "object")) {
				switch (JsHelper.typeOf(options.title)) {
				case "string":
					dialog.setTitle(options.title);

					break;
				case "object":
					dialog.bindProperty("title", options.title);

					break;
				}
			} else {
				dialog.bindProperty("title", {
					path: dialogTypeDefaults[options.type.toLowerCase()].titlePath
				});
			}
			dialog.setState(options.state);
			dialog.setType(dialogTypeDefaults[options.type.toLowerCase()].type);
			dialog.setShowHeader(!((!options.title || options.title.path === "") && !options.icon));
			dialog.setDraggable(options.draggable);
			dialog.setResizable(options.resizable);
			dialog.setContentWidth(options.contentWidth);
			dialog.setContentHeight(options.contentHeight);
			dialog.setVerticalScrolling(options.verticalScrolling);
			dialog.setHorizontalScrolling(options.horizontalScrolling);
			dialog.setStretch(options.stretch);
			dialog.setCustomHeader(options.customHeader);
			dialog.setSubHeader(options.subHeader);
			// options <<

			// content >>
			dialog.destroyContent();

			switch (JsHelper.typeOf(content)) {
			case "string":
				if (options.fragment) {
					dialog.addContent(sap.ui.xmlfragment(content, context));
				} else {
					dialog.addContent(new sap.m.Text({
						width: "100%",
						text: content,
						textAlign: options.textAlign
					}));
				}
				break;
			default:
				dialog.addContent(content);
				break;
			}

			if (options.padding) {
				dialog.addStyleClass("sapUiContentPadding");
			} else {
				dialog.addStyleClass("sapUiNoContentPadding");
			}

			if (context.getView) {
				context.getView().addDependent(dialog);
			}
			// content <<

			// contentDensity >>
			dialog.addStyleClass(this.getContentDensity(context));
			// contentDensity <<

			// actions >>
			dialog.destroyButtons();

			options.actions.forEach(function (action) {
				action = action.toLowerCase();

				dialog.addButton(new sap.m.Button({
					icon: options.buttonIcons ? options[action + "Icon"] || dialogActionDefaults[action].icon : null,
					text: options.buttonIcons ? null : options[action + "Text"] || {
						path: dialogActionDefaults[action].textPath
					},
					type: options[action + "Type"] || dialogActionDefaults[action].type,
					press: function (e) {
						var sourceDialog = this.getParentOfType(e.getSource(), "sap.m.Dialog");

						new Promise(function (resolve, reject) {
							if (options[action + "Callback"]) {
								options[action + "Callback"](reject, sourceDialog);
							}

							resolve();
						}).then(function () {
							sourceDialog.close();
						});
					}.bind(this)
				}));
			}.bind(this));
			// actions <<

			// additional handlers >>
			dialog.attachAfterOpen = sap.m.Dialog.prototype.attachAfterOpen; // eslint-disable-line sap-ui5-no-private-prop

			dialog.attachAfterOpen(function (e) {
				dialog = e.getSource();
				var domDialog = dialog.getDomRef();

				if (dialog.getType() === "Message") {
					setTimeout(function () { // eslint-disable-line sap-timeout-usage
						var footer = domDialog.querySelector("footer>*");

						if (footer && footer.classList.contains("sapContrast")) {
							footer.classList.remove("sapContrast");
						}
						if (footer && footer.classList.contains("sapContrastPlus")) {
							footer.classList.remove("sapContrastPlus");
						}

						// necessary since displaying a dialog within onInit or onAfterRendering would ignore dialogType = "Message"
					}, 50);
				}

				if (options.closeOnOuterTap) {
					document.onclick = function (sube) {
						if (sube.target.classList.contains("sapMDialogBlockLayerInit") || sube.target.classList.contains("sapUiBLy")) {
							var domDialogs = Array.prototype.slice.call(document.querySelectorAll("[class~=sapMDialog]"));
							var zIndices = domDialogs.reduce(function (acc, curval) {
								acc.push(curval.style.zIndex);

								return acc;
							}, []);
							var maxZIndex = Math.max.apply(null, zIndices);

							domDialog = domDialogs.find(function (node) {
								return node.style.zIndex === maxZIndex.toString();
							});
							dialog = sap.ui.getCore().byId(domDialog.id);

							new Promise(function (resolve, reject) {
								if (options.outerTapCallback) {
									options.outerTapCallback(reject, dialog);
								} else {
									if (options.closeCallback) {
										options.closeCallback(reject, dialog);
									}
								}

								resolve();
							}).then(function () {
								dialog.close();
							});
						}
					};
				}

				dialog.setEscapeHandler(function (escapePromise) {
					if (options.closeOnEscape) {
						new Promise(function (resolve, reject) {
							if (options.escapeCallback) {
								options.escapeCallback(reject, dialog);
							} else {
								if (options.closeCallback) {
									options.closeCallback(reject, dialog);
								}
							}

							resolve();
						}).then(function () {
							escapePromise.resolve();
						});
					} else {
						escapePromise.reject();
					}
				});

				if (options.openCallback) {
					options.openCallback();
				}
			});
			// additional handlers <<

			dialog.attachAfterOpen = null;

			if (options.autoOpen) {
				dialog.open();
			}

			return dialog;
		},
		/**
		 * Shorthand: calls showDialog to create a question dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		showQuestionDialog: function (context, content, options) {
			options = options || {};
			options.type = DialogType.Question;

			var dialog = this.showDialog(context, content, options);

			return dialog;
		},
		/**
		 * Shorthand: calls showDialog to create a success dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		showSuccessDialog: function (context, content, options) {
			options = options || {};
			options.type = DialogType.Success;

			var dialog = this.showDialog(context, content, options);

			return dialog;
		},
		/**
		 * Shorthand: calls showDialog to create a warning dialog.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 */
		showWarningDialog: function (context, content, options) {
			options = options || {};
			options.type = DialogType.Warning;

			var dialog = this.showDialog(context, content, options);

			return dialog;
		},
		/**
		 * Convert smartFilterBar filterData into an array of sap.ui.model.Filter objects.
		 * 
		 * @memberof regesta.regestalibrary.helper.UiHelper
		 * 
		 * @param	{object}	filterData	The object containing the filterbar's filter data.
		 * 
		 * @returns {array}					The array of translated filters.
		 */
		translateFilterData: function (filterData) {
			JsHelper.checkParameters("translateFilterData", [{
				name: "filterData",
				value: filterData,
				expected: ["object"]
			}]);

			var filterKeys = Object.keys(filterData);
			var filters = [];

			filterKeys.forEach(function (filterKey) {
				var filterKeyData = filterData[filterKey];
				var filter = new Filter([]);

				if (filterKeyData.items && filterKeyData.items.length > 0) {
					filterKeyData.items.forEach(function (item) {
						filter.aFilters.push(new Filter(filterKey, FilterOperator.EQ, item.key));
					});
				}

				if (filterKeyData.ranges && filterKeyData.ranges.length > 0) {
					filterKeyData.ranges.forEach(function (range) {
						filter.aFilters.push(new Filter(filterKey, FilterOperator[range.operation], range.value1, range.value2));
					});
				}

				if (filterKeyData.value) {
					filter.aFilters.push(new Filter(filterKey, FilterOperator.EQ, filterKeyData.value));
				}

				filters.push(filter);
			});

			return filters;
		}
	};
});