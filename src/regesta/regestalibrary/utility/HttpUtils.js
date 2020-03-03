// sap.ui.define(["regesta/regestalibrary/utilities/BindingUtils",
// 	"regesta/regestalibrary/utilities/DialogUtils",
// 	"regesta/regestalibrary/enums/DialogTypes"
// ], function (BindingUtils, DialogUtils, DialogTypes) {
// 	"use strict";
// 	var HttpUtils = {};

// 	var _resourceBundle = new sap.ui.model.resource.ResourceModel({
// 		bundleName: "regesta.regestalibrary.i18n.i18n"
// 	}).getResourceBundle();

// 	HttpUtils.ajax = function (url, options, bindings) {
// 		BindingUtils.checkParameters("ajax", [{
// 			name: "url",
// 			value: url
// 		}]);

// 		options = options || {};

// 		// TODO: global set busy
// 		// this.busy(bindings);

// 		$.ajax(url, {
// 			contentType: options.contentType,
// 			data: options.data,
// 			dataType: options.dataType || "json",
// 			headers: options.headers,
// 			method: options.method || "GET",
// 			success: function (data) {
// 				// TODO: global set busy
// 				// this.busy(bindings);

// 				if (options.success) {
// 					options.success.call(data);
// 				}
// 			}.bind(this),
// 			error: function (response) {
// 				// TODO: global set busy
// 				// this.busy(bindings);

// 				var parsedResponse = this.parseHttpError(response);

// 				if (options.error) {
// 					options.error.call(parsedResponse);
// 				}
// 			}.bind(this)
// 		});
// 	};

// 	HttpUtils.parseHttpError = function (context, response) {
// 		BindingUtils.checkParameters("httpError", [{
// 			name: "context",
// 			value: context
// 		}, {
// 			name: "response",
// 			value: response
// 		}]);

// 		var message;
// 		var businessError = false;

// 		response = this.parseResponse(response);

// 		message = _resourceBundle.getText(response.message.slice(-1) === "." ? response.message.slice(0, -1) : response.message);

// 		if (message === response.message) {
// 			if (response.statusText === "error") {
// 				message = response.message + " " + response.statusCode;
// 			} else {
// 				message = response.statusCode + " - " + (response.statusText || "") + "\n" + response.message;
// 			}
// 		} else {
// 			businessError = true;
// 		}

// 		DialogUtils.dialog(message, {
// 			type: DialogTypes.Error,
// 			rebuild: true
// 		});

// 		return {
// 			message: message,
// 			businessError: businessError
// 		};
// 	};

// 	HttpUtils.parseResponse = function (response) {
// 		BindingUtils.checkParameters("parseResponse", [{
// 			name: "response",
// 			value: response
// 		}]);

// 		var message = "";
// 		var status = 0;

// 		try {
// 			try {
// 				// response is json
// 				message = JSON.parse(response.responseText) ||
// 					JSON.parse(response.responseText).Message ||
// 					JSON.parse(response.responseText).error.message.value;
// 			} catch (exc) {
// 				// response is xml
// 				message = this.xml(response.responseText || response.statusText, "message");
// 			}
// 		} catch (exc) {
// 			throw (exc);
// 		}

// 		try {
// 			status = response.statusCode * 1 ||
// 				response.status * 1;
// 		} catch (exc) {
// 			throw (exc);
// 		}

// 		return {
// 			statusCode: status,
// 			statusText: status > 0 ? response.statusText || "error" : _resourceBundle.getText("noResponse"),
// 			message: status > 0 ? message || _resourceBundle.getText("genericError") : ""
// 		};
// 	};

// 	HttpUtils.getUrlParams = function () {
// 		var keyValuePairs = location.search.substr(1).split("&");
// 		var parameters = {};

// 		keyValuePairs.forEach(function (keyValue) {
// 			if (!keyValue) {
// 				return;
// 			}

// 			var key = keyValue.split("=")[0];
// 			var value = keyValue.split("=")[1];

// 			parameters[key] = value;
// 		});

// 		return parameters;
// 	};

// 	HttpUtils.setUrlParams = function (parametersToAdd) {
// 		BindingUtils.checkParameters("setUrlParams", [{
// 			name: "parametersToAdd",
// 			value: parametersToAdd
// 		}]);

// 		this.busy();

// 		onload = function () {
// 			this.busy(null, true);
// 		};

// 		var parameters = this.getUrlParams();
// 		var keyValuePairs = "";

// 		Object.keys(parametersToAdd).forEach(function (key) {
// 			var value = parametersToAdd[key];

// 			if (value) {
// 				parameters[key] = value;
// 			} else {
// 				delete parameters[key];
// 			}
// 		});

// 		Object.keys(parameters).forEach(function (key) {
// 			keyValuePairs += "&" + key;
// 			keyValuePairs += "=" + parameters[key];
// 		});

// 		location.search = keyValuePairs.substr(1);
// 	};

// 	return HttpUtils;
// });