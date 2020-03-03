/** 
 * Model related helper functions.
 * 
 * @module ModelHelper
*/

sap.ui.define([
	"regesta/regestalibrary/js/JsHelper",
	"regesta/regestalibrary/js/MessageHelper",
	"regesta/regestalibrary/js/UiHelper"
], function (JsHelper, MessageHelper, UiHelper) {
	"use strict";

	var createCallersMesages = function (targets, url, error) {
		var messages = targets.reduce(function (acc, curr) {
			acc.push({
				message: error,
				processor: curr.getModel(),
				target: curr.getContext() ? curr.getContext() + "/" + curr.getPath() : curr.getPath()
			});

			return acc;
		}, []);

		if (messages.length === 0) {
			messages.push({
				message: error,
				target: url
			});
		}

		return messages;
	};

	return {
		/** 
		 * Executes an ajax call.
		 * 
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n		The i18n model for parsing the response.
		 * @param	{string}								url			The url to call.
		 * @param	{object}								options		Additional options for the http call. Refer to {@link http://api.jquery.com/jquery.ajax/} to see the full option list.
		 * @param	{array}									[callers]	An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		ajax: function (i18n, url, options, callers) {
			JsHelper.checkParameters("ajax", [{
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}]);

			options = options || {};
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];
			
			options.method = options.method || "GET";
			options.type = options.type || "GET";

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			$.ajax(url, {
				accepts: options.accepts,
				async: options.async,
				beforeSend: options.beforeSend,
				cache: options.cache,
				complete: options.complete,
				contents: options.contents,
				contentType: options.contentType,
				context: options.context,
				converters: options.converters,
				crossDomain: options.crossDomain,
				data: options.data,
				dataFilter: options.dataFilter,
				dataType: options.dataType,
				global: options.global,
				headers: options.headers,
				ifModified: options.ifModified,
				isLocal: options.isLocal,
				jsonp: options.jsonp,
				jsonpCallback: options.jsonpCallback,
				method: options.method,
				mimeType: options.mimeType,
				password: options.password,
				processData: options.processData,
				scriptCharset: options.scriptCharset,
				statusCode: options.statusCode,
				timeout: options.timeout,
				traditional: options.traditional,
				type: options.type,
				username: options.username,
				xhr: options.xhr,
				xhrFields: options.xhrFields,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps an ajax call into a promise.
		 * 
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n		The i18n model for parsing the response.
		 * @param	{string}								url			The url to call.
		 * @param	{object}								options		Additional options for the http call. Refer to {@link http://api.jquery.com/jquery.ajax/} to see the full option list (success and resolve won't be considered).
		 * @param	{array}									[bindings]	An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * çreturns	{Promise}											The resulting promise.
		 */
		ajaxAsync: function (i18n, url, options, callers) {
				return new Promise(function (resolve, reject) {
						options = options || {};
						options.success = resolve;
						options.error = reject;
		
						this.ajax(i18n, url, options, callers);
				}.bind(this));
		},
		/** 
		 * Triggers a request to a function import of the specified odata service.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The (relative) url of the function import.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{function}								options.success			The callback to be called when the request has successfully end execution.
		 * @param	{function}								options.error			The callback to be called when the request fails.
		 * @param	{array}									[callers]				An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		callFunction: function (model, i18n, url, options, callers) {
			JsHelper.checkParameters("callFuntion", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}]);

			var functionImportMetadata = this.getFunctionImportMetadata(model, url.substr(1));

			options = options || {};
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];
			
			options.urlParameters = options.urlParameters || {};
			
			options.urlParameters = this.formalizePostData(options.urlParameters, functionImportMetadata);

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			model.callFunction(url, {
				method: functionImportMetadata.httpMethod,
				urlParameters: options.urlParameters,
				headers: options.headers,
				groupId: options.groupId,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data[functionImportMetadata.name]);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps a function import call into a promise.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The (relative) url of the function import.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{array}									[bindings]				An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * @returns	{Promise}														The resulting promise.
		 */
		callFunctionAsync: function (model, i18n, url, options, callers) {
				return new Promise(function (resolve, reject) {
					options = options || {};
					options.success = resolve;
					options.error = reject;
	
					this.callFunction(model, i18n, url, options, callers);
				}.bind(this));
		},
		/** 
		 * Triggers a create request to the specified odata service.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The entity to which the new entry should belong.
		 * @param	{object}								newData					The data for creating the entry.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{function}								options.success			The callback to be called when the request has successfully end execution.
		 * @param	{function}								options.error			The callback to be called when the request fails.
		 * @param	{array}									[callers]				An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		create: function (model, i18n, url, newData, options, callers) {
			JsHelper.checkParameters("create", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}, {
				name: "newData",
				value: newData,
				expected: ["object"]
			}]);

			var entitySetMetadata = this.getEntitySetMetadata(model, url.substr(1));
			var entityMetadata = this.getEntityMetadata(model, entitySetMetadata.entityType.split(".").pop());

			options = options || {};
			newData = this.formalizePostData(newData, entityMetadata);
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			model.create(url, newData, {
				urlParameters: options.urlParameters,
				headers: options.headers,
				groupId: options.groupId,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps a create request into a promise.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The entity to which the new entry should belong.
		 * @param	{object}								newData					The data for creating the entry.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{array}									[bindings]				An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * @returns	{promise}														The resulting promise.
		 */
		createAsync: function (model, i18n, url, newData, options, callers) {
				return new Promise(function (resolve, reject) {
					options = options || {};
					options.success = resolve;
					options.error = reject;
	
					this.create(model, i18n, url, newData, options, callers);
				}.bind(this));
		},
		/** 
		 * Formalize an object properties basing on the metadata defining an odata entity, in order to be used for a create/update odata request.
		 * 
		 * @param	{object}	postData		The data to be formalized.
		 * @param	{object}	metadata		The metadata of the entity to be created/updated or the functionImport to be called.
		 * 
		 * @returns {object}	The formalized data.
		 */
		formalizePostData: function (postData, metadata) {
			JsHelper.checkParameters("formalizePostData", [{
				name: "postData",
				value: postData,
				expected: ["object"]
			}, {
				name: "metadata",
				value: metadata,
				expected: ["object"]
			}]);

			Object.keys(postData).forEach(function (property) {
				var propertyMetadata = (metadata.property || metadata.parameter).find(function (item) {
					return item.name === property;
				});

				if (propertyMetadata) {
					var type = JsHelper.typeOf(postData[property]);

					switch (propertyMetadata.type) {
					case "Edm.Decimal":
						postData[property] = JsHelper.parseFormattedNumber(postData[property] * 1).toString();
						break;
					case "Edm.Int16":
					case "Edm.Int32":
					case "Edm.Int64":
						postData[property] = JsHelper.parseFormattedNumber(postData[property]);
						break;
					case "Edm.String":
						if (type === "object" || type === "array") {
							postData[property] = JSON.stringify(postData[property]);
						} else {
							postData[property] = (postData[property] || "").toString();
						}
					}
				}
			}.bind(this));

			return postData;
		},
		/**
		 * Formats a response message. Use "|" to separate message parameters (e.g. message|p1|p2|..pn).
		 * Parameter type and formatOptions can be specified respectively with &type=... and &formatOptions=... 
		 * (e.g. message|p1&type=sap.ui.model.Integer|p2&type=sap.ui.model.type.Float&formatOptions={"decimals":3}).
		 * 
		 * @param	{string}								responseMessage	The message to be formatted.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n			The i18n model for parsing the message.
		 * 
		 * @returns {string}												The formatted message.
		 */
		formatResponseMessage: function (responseMessage, i18n) {
			JsHelper.checkParameters("formatResponseMessage", [{
				name: "responseMessage",
				value: responseMessage,
				expected: ["string"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}]);

			var key = responseMessage.split("|")[0];
			var parameters = responseMessage.split("|").slice(1);

			parameters = parameters.map(function (parameter) {
				var parameterParts = parameter.split("&");

				if (parameterParts.length > 1) {
					var value = parameterParts.find(function (parts) {
						return !parts.includes("type") && !parts.includes("formatOptions");
					});
					var type = parameterParts.find(function (parts) {
						return parts.includes("type");
					});
					var formatOptions = parameterParts.find(function (parts) {
						return parts.includes("formatOptions");
					});

					if (type) {
						type = type.replace("type=", "");
					}
					if (formatOptions) {
						formatOptions = JSON.parse(formatOptions.replace("formatOptions=", ""));
					}

					if (type && formatOptions) {
						var formatter = new(JsHelper.getObjectByPath(type, "."))(formatOptions);

						return formatter.formatValue(value, "string");
					}

					return value;
				}

				return parameter;
			});

			var message = i18n.getResourceBundle().getText(key, parameters);

			return message;
		},
		/**
		 * Shorthand: calls getModel and returns the context's default model.
		 */
		getDefaultModel: function (context) {
			var model = this.getModel(context);

			return model;
		},
		/**
		 * Returns the metadata of the given entityName.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}	model		The odata model of the service to call.
		 * @param	{string}							entityName	The entity of which searching the metadata.
		 * 
		 * @returns	{object} The entity metadata.
		 */
		getEntityMetadata: function (model, entityName) {
			JsHelper.checkParameters("getEntityMetadata", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "entityName",
				value: entityName,
				expected: ["string"]
			}]);

			var metadata = model.getServiceMetadata();
			var entityMetadata = metadata.dataServices.schema[0].entityType.find(function (entityType) {
				return entityType.name === entityName;
			});

			return entityMetadata;
		},
		/**
		 * Returns the entity metadata of the given entitySet name.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}	model			The odata model of the service to call.
		 * @param	{string}							entitySetName	The entity of which searching the metadata.
		 * 
		 * @returns	{object} The entitySet entity metadata.
		 */
		getEntitySetEntityMetadata: function (model, entitySetName) {
			JsHelper.checkParameters("getEntitySetEntityMetadata", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "entitySetName",
				value: entitySetName,
				expected: ["string"]
			}]);

			var metadata = model.getServiceMetadata();
			var entitySetMetadata = metadata.dataServices.schema[0].entityContainer[0].entitySet.find(function (entitySet) {
				return entitySet.name === entitySetName;
			});
			var entityMetadata = this.getEntityMetadata(model, entitySetMetadata.entityType.split(".")[1]);

			return entityMetadata;
		},
		/**
		 * Returns the metadata of the given entitySet name.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}	model			The odata model of the service to call.
		 * @param	{string}							entitySetName	The entity of which searching the metadata.
		 * 
		 * @returns	{object} The entitySet metadata.
		 */
		getEntitySetMetadata: function (model, entitySetName) {
			JsHelper.checkParameters("getEntityMetadata", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "entitySetName",
				value: entitySetName,
				expected: ["string"]
			}]);

			var metadata = model.getServiceMetadata();
			var entitySetMetadata = metadata.dataServices.schema[0].entityContainer[0].entitySet.find(function (entitySet) {
				return entitySet.name === entitySetName;
			});

			return entitySetMetadata;
		},
		/**
		 * Returns the metadata of the functionImport with the given name.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}	model				The odata model of the service to call.
		 * @param	{string}							functionImportName	The entity of which searching the metadata.
		 * 
		 * @returns	{object} The functionImport metadata.
		 */
		getFunctionImportMetadata: function (model, functionImportName) {
			JsHelper.checkParameters("getEntityMetadata", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "functionImportName",
				value: functionImportName,
				expected: ["string"]
			}]);

			var metadata = model.getServiceMetadata();
			var FunctionImportMetadata = metadata.dataServices.schema[0].entityContainer[0].functionImport.find(function (functionImport) {
				return functionImport.name === functionImportName;
			});

			return FunctionImportMetadata;
		},
		/**
		 * Shorthand: calls getModel and returns the context's 1i8n model.
		 */
		getI18nModel: function (context) {
			var model = this.getModel(context, "i18n");

			return model;
		},
		/**
		 * Shorthand: calls getModel and returns the context's local model.
		 */
		getLocalModel: function (context) {
			var model = this.getModel(context, "local");

			return model;
		},
		/**
		 * Returns the model with the given name.
		 * 
		 * @param	{sap.ui.core.mvc.Controller}	context The context in which searching the model.
		 * @param	{string}						name	The name of the model.
		 * 
		 * @returns {sap.ui.model.odata.v2.ODataModel|sap.ui.model.json.JSONModel|sap.base.i18n.ResourceBundle}	The found model.
		 */
		getModel: function (context, name) {
			JsHelper.checkParameters("getModel", [{
				name: "context",
				value: context,
				expected: ["sap.ui.core.mvc.Controller"]
			}]);

			var model = context.getView().getModel(name);

			return model;
		},
		/** 
		 * Extracts the exception message from an HTTP request's error response. 
		 * If the message in the response is translatable (and therefore coincide with the key of an entry in the i18n file), the error will be considered as a "business error", otherwise a "technical error".
		 * 
		 * @param	{httpError}								response	The object containing additional informations of an erroneous HTTP call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n		The i18n model for parsing the response.
		 * 
		 * @returns	{object}											An object containing the message of the error and a boolean value indicating whether the error is of type business.
		 *																In case of technical error the message will be the concatenation of status code, status text (if significant) and message, otherwise the translated text will be shown.
		 */
		httpError: function (response, i18n) {
			JsHelper.checkParameters("httpError", [{
				name: "response",
				value: response,
				expected: ["object"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}]);

			var message;

			response = this.parseResponse(response);
			message = this.formatResponseMessage(response.message, i18n);

			if (message === response.message) {
				if (response.statusText === "error") {
					message = response.statusCode + " - " + response.message;
				} else {
					message = response.statusCode + " - " + (response.statusText || "") + "\n" + response.message;
				}
			}

			return message;
		},
		/** 
		 * Extracts statusCode, statusText and message from an HTTP resuest's response.
		 * 
		 * @param	{object}	response	The response.
		 * 
		 * @returns {object}				An object containing statusCode, statusText and message of the response.
		 */
		parseResponse: function (response) {
			JsHelper.checkParameters("parseResponse", [{
				name: "response",
				value: response,
				expected: ["object"]
			}]);

			var message = "";
			var status = 0;

			try {
				try {
					// response is json
					message = JSON.parse(response.responseText);

					if (JsHelper.typeOf(message) !== "string") {
						message = JSON.parse(response.responseText).Message;
					}

					if (JsHelper.typeOf(message) !== "string") {
						message = JSON.parse(response.responseText).error.message.value;
					}
				} catch (exc) {
					// response is xml
					message = JsHelper.parseXml(response.responseText || response.statusText, "message");

					if (message.split("-").length > 1) {
						message = message.split("-")[1].slice(1);
					}
				}
			} catch (exc) {
				throw (exc);
			}

			try {
				status = response.statusCode * 1 || response.status * 1;
			} catch (exc) {
				throw (exc);
			}

			return {
				statusCode: status,
				statusText: status > 0 ? response.statusText || "error" : {
					path: "i18n>errNoResponse"
				},
				message: status > 0 ? message || {
					path: "i18n>errGenericError"
				} : ""
			};
		},
		/** 
		 * Triggers a read request to the specified odata service.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n resourceBundle for parsing the response.
		 * @param	{string}								url						The entity to read.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{array}									options.filters			An array of sap.ui.model.Filter.
		 * @param	{array}									options.sorters			An array of sap.ui.model.Sorter.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{function}								options.success			The callback to be called when the request has successfully end execution.
		 * @param	{function}								options.error			The callback to be called when the request fails.
		 * @param	{array}									[callers]				An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		read: function (model, i18n, url, options, callers) {
			JsHelper.checkParameters("read", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}]);

			options = options || {};
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			model.read(url, {
				urlParameters: options.urlParameters,
				filters: options.filters,
				sorters: options.sorters,
				groupId: options.groupId,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data.results);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps a read request into a promise.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The entity to read.
		 * @param	{object}								[options]				Additional options for the http call.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{array}									options.filters			An array of sap.ui.model.Filter.
		 * @param	{array}									options.sorters			An array of sap.ui.model.Sorter.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{array}									[bindings]				An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * @returns	{Promise}														The resulting promise.
		 */
		readAsync: function (model, i18n, url, options, callers) {
				return new Promise(function (resolve, reject) {
					options = options || {};
					options.success = resolve;
					options.error = reject;
	
					this.read(model, i18n, url, options, callers);
				}.bind(this));
		},
		/** 
		 * Triggers a remove request to the specified odata service.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The path of the entry to be removed.
		 * @param	{object}								[options]				Additional options for deletion.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{function}								options.success			The callback to be called when the request has successfully end execution.
		 * @param	{function}								options.error			The callback to be called when the request fails.
		 * @param	{array}									[callers]				An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		remove: function (model, i18n, url, options, callers) {
			JsHelper.checkParameters("remove", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}]);

			options = options || {};
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			model.remove(url, {
				urlParameters: options.urlParameters,
				headers: options.headers,
				groupId: options.groupId,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps a remove request into a promise.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The path of the entry to be removed.
		 * @param	{object}								[options]				Additional options for deletion.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{array} 								[bindings]				An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * @returns	{Promise}														The resulting promise.
		 */
		removeAsync: function (model, i18n, url, options, callers) {
				return new Promise(function (resolve, reject) {
					options = options || {};
					options.success = resolve;
					options.error = reject;
	
					this.remove(model, i18n, url, options, callers);
				}.bind(this));
		},
		/**
		 * Sets a property in a model, basing on given control property's biningInfo.
		 * 
		 * @param	{sap.ui.core.Control}	control		The source control.
		 * @param	{string}				property	The control property.
		 * @param	{*}						[value]
		 */
		setBindedProperty: function (control, property, value) {
			JsHelper.checkParameters("setBindedProperty", [{
				name: "control",
				value: control,
				expected: ["sap.ui.core.Control"]
			}, {
				name: "property",
				value: property,
				expected: ["string"]
			}]);

			var binding = control.getBinding(property);
			var bindingContext = binding.getContext();
			var bindingModel = binding.getModel();
			var bindingPath = binding.getPath();

			bindingModel.setProperty(bindingContext ? bindingContext + "/" + bindingPath : bindingPath, value);
		},
		/** 
		 * Triggers an update request to the specified odata service.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The path of the entry to be updated.
		 * @param	{object}								newData					The data for updating the entry.
		 * @param	{object}								[options]				Additional options for the function import.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{function}								options.success			The callback to be called when the request has successfully end execution.
		 * @param	{function}								options.error			The callback to be called when the request fails.
		 * @param	{array}									[callers]				An array of sap.ui.core.control from which determine value and busy bindings to use during the call.
		 */
		update: function (model, i18n, url, newData, options, callers) {
			JsHelper.checkParameters("update", [{
				name: "model",
				value: model,
				expected: ["sap.ui.model.odata.v2.ODataModel"]
			}, {
				name: "i18n",
				value: i18n,
				expected: ["sap.ui.model.resource.ResourceModel"]
			}, {
				name: "url",
				value: url,
				expected: ["string"]
			}, {
				name: "newData",
				value: newData,
				expected: ["object"]
			}]);

			var entitySetMetadata = this.getEntitySetMetadata(model, url.substr(1));
			var entityMetadata = this.getEntityMetadata(model, entitySetMetadata.entityType.split(".").pop());

			options = options || {};
			newData = this.formalizePostData(newData, entityMetadata);
			callers = callers || [];
			callers = JsHelper.typeOf(callers) === "array" ? callers : [callers];

			var busyBindings = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("busy");
				
				acc.push(binding);

				return acc;
			}, []);
			var messageTargets = callers.reduce(function (acc, curr) {
				var binding = curr.getBinding("value");
				
				acc.push(binding);

				return acc;
			}, []);

			if (messageTargets.length === 0) {
				messageTargets = [url];
			}

			UiHelper.showBusy(busyBindings);
			MessageHelper.removeMessages({
				targets: messageTargets.reduce(function(acc, curr){
					acc.push(curr.getPath());
					
					return acc;
				}, [])
			});

			model.update(url, newData, {
				urlParameters: options.urlParameters,
				headers: options.headers,
				groupId: options.groupId,
				success: function (data) {
					UiHelper.showBusy(busyBindings, true);

					if (options.success) {
						options.success(data);
					}
				}.bind(this),
				error: function (response) {
					UiHelper.showBusy(busyBindings, true);

					var parsedResponse = this.httpError(response, i18n);

					MessageHelper.addErrorMessages(createCallersMesages(messageTargets, url, parsedResponse));

					if (options.error) {
						options.error(parsedResponse, response);
					}
				}.bind(this)
			});
		},
		/** 
		 * Wraps an update request in a promise.
		 * 
		 * @param	{sap.ui.model.odata.v2.ODataModel}		model					The odata model of the service to call.
		 * @param	{sap.ui.model.resource.ResourceModel}	i18n					The i18n model for parsing the response.
		 * @param	{string}								url						The path of the entry to be updated.
		 * @param	{object}								newData					The data for updating the entry.
		 * @param	{object}								[options]				Additional options for the function import.
		 * @param	{object}								options.urlParameters	An object containing the parameters that will be passed as query strings.
		 * @param	{object}								options.headers			An object of headers for this request.
		 * @param	{string}								options.groupId			The id of the batch to which the request shoiìuld be bundled.
		 * @param	{array} 								[bindings]				An array of sap.ui.model.Binding to the busy property of the controls to set busy during the execution of the request. If not provided, the sap.ui.core.BusyIndicator will be displayed.
		 * 
		 * @returns {Promise}														The resulting promise.
		 */
		updateAsync: function (model, i18n, url, newData, options, callers) {
				return new Promise(function (resolve, reject) {
					options = options || {};
					options.success = resolve;
					options.error = reject;
	
					this.update(model, i18n, url, newData, options, callers);
				}.bind(this));
		}
	};
});