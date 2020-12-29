/** 
 * MessageManager related helper functions.
 * 
 * @class regesta.regestalibrary.helper.MessageHelper
 * @memberof regesta.regestalibrary.helper
 * @hideconstructor
*/

sap.ui.define([
	"regesta/regestalibrary/helper/JsHelper",
	"regesta/regestalibrary/helper/UiHelper",
	"sap/ui/core/MessageType",
	"sap/ui/core/message/Message",
	"sap/ui/core/ValueState"
], function (JsHelper, UiHelper, MessageType, Message, ValueState) {
	"use strict";

	return {
		/**
		 * Shorthand: calls addMessages for adding one or more error messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		addErrorMessages: function (options) {
			options = options || {};

			if (JsHelper.typeOf(options) === "object") {
				options.type = MessageType.Error;
			} else {
				options.forEach(function (item) {
					item.type = MessageType.Error;
				});
			}

			this.addMessages(options);
		},
		/**
		 * Shorthand: calls addMessages for adding one or more information messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		addInformationMessages: function (options) {
			options = options || {};

			if (JsHelper.typeOf(options) === "object") {
				options.type = MessageType.Information;
			} else {
				options.forEach(function (item) {
					item.type = MessageType.Information;
				});
			}

			this.addMessages(options);
		},
		/**
		 * Adds one or more message to the messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 * 
		 * @param	{object|array}							[options]									An object or an array of objects defining the options for creating the messages.
		 * @param	{string}								options.id									The message id: will be generated if no id is set
		 * @param	{string}								options.message 							The message text
		 * @param	{string}								options.description 						The message description
		 * @param	{string}								options.descriptionUrl						The message description url to get a more detailed message
		 * @param	{string}								options.additionalText						The message additionalText
		 * @param	{sap.ui.core.MessageType}				options.type=sap.ui.core.MessageType.None	The message type
		 * @param	{string}								options.code								The message code
		 * @param	{boolean}								options.technical							Defines if the message is set as technical message
		 * @param	{object}								options.technicalDetails					An object containg technical details for a message
		 * @param	{sap.ui.core.message.MessageProcessor}	options.processor							The processor of the message
		 * @param	{string}								options.target								The message target: The syntax is MessageProcessor dependent. Read the documentation of the respective MessageProcessor.
		 * @param	{boolean}								options.persistent							Sets message persistent: If persistent is set true the message lifecycle is controlled by the application
		 * @param	{int}									options.date=Date.now()						Sets message date which can be used to remove old messages. Number of milliseconds elapsed since 1 January 1970 00:00:00 UTC
		 * @param	{string}								options.fullTarget							Defines more detailed information about the message target. This property is currently only used by the ODataMessageParser.
		 */
		addMessages: function (options) {
			JsHelper.checkParameters("addMessages", [{
				name: "options",
				value: options,
				expected: ["object", "array"]
			}]);

			var core = sap.ui.getCore();
			var messageManager = core.getMessageManager();

			if (JsHelper.typeOf(options) === "object") {
				options = [options];
			}

			options.forEach(function (option) {
				var message = new Message({
					id: option.id,
					message: JsHelper.typeOf(option.message) === "object" ? {
						path: option.message.path,
						model: option.message.model
					} : option.message,
					description: option.description,
					descriptionUrl: option.descriptionUrl,
					additionalText: option.additionalText,
					type: option.type,
					code: option.code,
					technical: option.technical,
					technicalDetails: option.technicalDetails,
					processor: option.processor,
					target: option.target,
					persistent: option.persistent,
					date: option.date,
					fullTarget: option.fullTarget
				});

				messageManager.addMessages(message); // addMessages(arrayOfMessages) doesn't allow adding multiple messages without target
			});
		},
		/**
		 * Shorthand: calls addMessages for adding one or more success messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		addSuccessMessages: function (options) {
			options = options || {};

			if (JsHelper.typeOf(options) === "object") {
				options.type = MessageType.Success;
			} else {
				options.forEach(function (item) {
					item.type = MessageType.Success;
				});
			}

			this.addMessages(options);
		},
		/**
		 * Shorthand: calls addMessages for adding one or more warning messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		addWarningMessages: function (options) {
			options = options || {};

			if (JsHelper.typeOf(options) === "object") {
				options.type = MessageType.Warning;
			} else {
				options.forEach(function (item) {
					item.type = MessageType.Warning;
				});
			}

			this.addMessages(options);
		},
		/**
		 * Shorthand: calls getMessages for getting all messages of type sap.ui.core.MessageType.Error.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		getErrorMessages: function (options) {
			options = options || {};
			options.types = MessageType.Error;

			var messages = this.getMessages(options);

			return messages;
		},
		/**
		 * Shorthand: calls getMessages for getting all messages of type sap.ui.core.MessageType.Information.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		getInformationMessages: function (options) {
			options = options || {};
			options.types = MessageType.Information;

			var messages = this.getMessages(options);

			return messages;
		},
		/**
		 * Returns the messages contained in the messageManager model.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 *
		 * @param	{object}											options							Additional options.
		 * @param	{string|string[]}									options.targets					An array of targets for filtering messages, empty array to return only messages that don't have target, null or undefined to avoid filtering.
		 * @param	{boolean}											options.excludeTechnical=true	A boolean to exclude message technical (e.g. generated by the UI5 framework) messages.
		 * @param	{sap.ui.core.MessageType|sap.ui.core.MessageType[]} options.types					An array of messageTypes for filtering messages, null or undefined to avoid filtering.
		 * @param	{boolean}											options.excludeNoText=true		A boolean to exclude message that have no text.
		 * 
		 * @returns {array} 																			An array of sap.ui.core.message.Message.
		 */
		getMessages: function (options) {
			var core = sap.ui.getCore();
			var messageManager = core.getMessageManager();
			var messageModel = messageManager.getMessageModel();
			var messages = messageModel.getProperty("/");

			options = options || {};
			options.excludeTechnical = options.excludeTechnical ? options.excludeTechnical : options.excludeTechnical !== false;
			options.excludeNoText = options.excludeNoText ? options.excludeNoText : options.excludeNoText !== false;

			if (options.excludeNoText) {
				messages = messages.filter(function (message) {
					return message.getMessage();
				});
			}
			if (options.targets !== null && options.targets !== undefined) {
				if (JsHelper.typeOf(options.targets) !== "array") {
					options.targets = [options.targets];
				}
				
				options.targets = options.targets.filter(function(target){
					return target;
				});

				messages = messages.filter(function (message) {
					return options.targets.length === 0 ? !message.getTarget() : options.targets.find(function(target){
						return (message.getTarget() || "").indexOf(target) > -1;
					});
				});
			}
			if (options.excludeTechnical) {
				messages = messages.filter(function (message) {
					return !message.getTechnical();
				});
			}
			if (options.types !== null && options.types !== undefined) {
				if (JsHelper.typeOf(options.types) !== "array") {
					options.types = [options.types];
				}

				messages = messages.filter(function (message) {
					return options.types.includes(message.getType());
				});
			}

			return messages;
		},
		/**
		 * Shorthand: calls getMessages for getting all messages of type sap.ui.core.MessageType.Success.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		getSuccessMessages: function (options) {
			options = options || {};
			options.types = MessageType.Success;

			var messages = this.getMessages(options);

			return messages;
		},
		/**
		 * Shorthand: calls getMessages for getting all messages of type sap.ui.core.MessageType.None.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		getUntypedMessages: function (options) {
			options = options || {};
			options.types = MessageType.None;

			var messages = this.getMessages(options);

			return messages;
		},
		/**
		 * Shorthand: calls getMessages for getting all messages of type sap.ui.core.MessageType.Warning.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		getWarningMessages: function (options) {
			options = options || {};
			options.types = MessageType.Warning;

			var messages = this.getMessages(options);

			return messages;
		},
		/**
		 * Registers given view to the messageManager and sets a global model binded to its messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 * 
		 * @param {sap.ui.core.mvc.Controller} context The controller of view to register.
		 */
		registerView: function (context) {
			JsHelper.checkParameters("registerView", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}]);

			var core = sap.ui.getCore();
			var messageManager = core.getMessageManager();

			messageManager.registerObject(context.getView(), true);
		},
		/**
		 * Shorthand: calls removeMessages to remove error messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		removeErrorMessages: function (options) {
			options = options || {};
			options.types = MessageType.Error;

			this.removeMessages(options);
		},
		/**
		 * Shorthand: calls removeMessages to remove information messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		removeInformationMessages: function (options) {
			options = options || {};
			options.types = MessageType.Information;

			this.removeMessages(options);
		},
		/**
		 * Removes messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 * 
		 * @param	{object}											[options]						Additional options.
		 * @param	{string|string[]}									options.targets					An array of targets for deleting messages, empty array to delete only messages that don't have target, null or undefined to delete all messages.
		 * @param	{boolean}											options.excludeTechnical=false	A boolean to exclude message technical (e.g. generated by the UI5 framework) messages.
		 * @param	{sap.ui.core.MessageType|sap.ui.core.MessageType[]} options.types					An array of messageTypes for deleting messages, null or undefined to delete all messages.
		 * @param	{boolean}											options.excludeNoText=false		A boolean to exclude message that have no text.
		 */
		removeMessages: function (options) {
			options = options || {};
			
			options.excludeTechnical = false;
			options.excludeNoText = false;
			
			var core = sap.ui.getCore();
			var messageManager = core.getMessageManager();
			var messages = this.getMessages(options);

			messageManager.removeMessages(messages);
		},
		/**
		 * Shorthand: calls removeMessages to remove success messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		removeSuccessMessages: function (options) {
			options = options || {};
			options.types = MessageType.Success;

			this.removeMessages(options);
		},
		/**
		 * Shorthand: calls removeMessages to remove untyped messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		removeUntypedMessages: function (options) {
			options = options || {};
			options.types = MessageType.None;

			this.removeMessages(options);
		},
		/**
		 * Shorthand: calls removeMessages to remove warning messages from messageManager.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		removeWarningMessages: function (options) {
			options = options || {};
			options.types = MessageType.Warning;

			this.removeMessages(options);
		},
		/**
		 * Shorthand: Calls showMessages for displaying a list of error messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		showErrorMessages: function (context, options, dialogOptions) {
			options = options || {};
			options.types = MessageType.Error;

			this.showMessages(context, options, dialogOptions);
		},
		/**
		 * Shorthand: Calls showMessages for displaying a list of information messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		showInformationMessages: function (context, options, dialogOptions) {
			options = options || {};
			options.types = MessageType.Information;

			this.showMessages(context, options, dialogOptions);
		},
		/**
		 * Displays a dialog containing the list of messageManager messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context							The controller for the dialog.
		 * @param	{object}						[options]						Optional parameters.
		 * @param	{array}							options.targets 				An array of targets for filtering the messages, empty string ("") to delete only messages that don't have target, null or undefined to avoid filtering.
		 * @param	{boolean}						options.excludeTechnical=true	A boolean to exclude message technical (e.g. generated by the UI5 framework) messages.
		 * @param	{string}						options.type					An array of messageTypes for deleting messages, null or undefined to avoid filtering.
		 * @param	{boolean}						options.excludeNoText=true		A boolean to exclude message that have no text.
		 * @param	{object}						[dialogOptions]					Optional options for the dialog to display (refrer to UiHelper.dialog for the complete list of parameters).
		 */
		showMessages: function (context, options, dialogOptions) { // eslint-disable-line complexity
			JsHelper.checkParameters("showMessages", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}]);

			options = options || {};

			dialogOptions = dialogOptions || {};

			var errorMessages = !options.types || options.types === MessageType.Error || options.types.includes(MessageType.Error) ? this.getErrorMessages({
				targets: options.targets,
				technical: options.technical
			}) : [];
			var warningMessages = !options.types || options.types === MessageType.Warning || options.types.includes(MessageType.Warning) ? this.getWarningMessages({
				targets: options.targets,
				technical: options.technical
			}) : [];
			var successMessages = !options.types || options.types === MessageType.Success || options.types.includes(MessageType.Success) ? this.getSuccessMessages({
				targets: options.targets,
				technical: options.technical
			}) : [];
			var informationMessages = !options.types || options.types === MessageType.Information || options.types.includes(MessageType.Information) ?
				this.getInformationMessages({
					targets: options.targets,
					technical: options.technical
				}) : [];
			var untypedMessages = !options.types || options.types === MessageType.None || options.types.includes(MessageType.None) ? this.getUntypedMessages({
				targets: options.targets,
				technical: options.technical
			}) : [];
			var messages = errorMessages.concat(warningMessages, successMessages, informationMessages, untypedMessages);

			if (errorMessages.length > 0 && !dialogOptions.type) {
				dialogOptions.type = ValueState.Error;
			} else if (warningMessages.length > 0 && !dialogOptions.type) {
				dialogOptions.type = ValueState.Warning;
			} else if (successMessages.length > 0 && !dialogOptions.type) {
				dialogOptions.type = ValueState.Success;
			} else if (informationMessages.length > 0 && !dialogOptions.type) {
				dialogOptions.type = ValueState.Information;
			}

			if (messages.length === 0) {
				return;
			}

			UiHelper.showDialog(context, new sap.m.List({
				showSeparators: "None",
				items: {
					path: "/",
					template: new sap.m.StandardListItem({
						title: {
							path: "message"
						},
						highlight: {
							path: "type",
							formatter: function (type) {
								switch (type) {
								case MessageType.Error:
									return sap.ui.core.ValueState.Error;
								case MessageType.Warning:
									return sap.ui.core.ValueState.Warning;
								case MessageType.Information:
									return sap.ui.core.ValueState.Information;
								case MessageType.Success:
									return sap.ui.core.ValueState.Success;
								default:
									return sap.ui.core.ValueState.None;
								}
							}
						}
					})
				}
			}).setModel(new sap.ui.model.json.JSONModel(messages)), dialogOptions);
		},
		/**
		 * Shorthand: Calls showMessages for displaying a list of success messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		showSuccessMessages: function (context, options, dialogOptions) {
			options = options || {};
			options.types = MessageType.Success;

			this.showMessages(context, options, dialogOptions);
		},
		/**
		 * Shorthand: Calls showMessages for displaying a list of untyped messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		showUntypedMessages: function (context, options, dialogOptions) {
			options = options || {};
			options.types = MessageType.Untyped;

			this.showMessages(context, options, dialogOptions);
		},
		/**
		 * Shorthand: Calls showMessages for displaying a list of warning messages.
		 * 
		 * @memberof regesta.regestalibrary.helper.MessageHelper
		 */
		showWarningMessages: function (context, options, dialogOptions) {
			options = options || {};
			options.types = MessageType.Warning;

			this.showMessages(context, options, dialogOptions);
		}
	};
});