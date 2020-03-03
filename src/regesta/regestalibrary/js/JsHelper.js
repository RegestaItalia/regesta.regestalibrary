sap.ui.define([], function () {
	"use strict";

	return {
		/** 
		 * Checks an array of mandatory parameters and throws an exception if a specified parameter is initial or has wrong type.
		 * 
		 * @param	{string}	functionName		The name of the function from which this is called (for logging purposes).
		 * @param	{array} 	parameters			An array of parameters to check. Each parameter have to be structured as follows:
		 * @param	{string}	parameters.name 	The name of the parameter.
		 * @param	{*} 		parameters.value	The value of the parameter.
		 * @param	{array} 	parameters.expected An array of possible types (as strings) of the parameter.
		 * 
		 * @throws									Will throw an error if one of the parameters is blank or of the wrong type.
		 */
		checkParameters: function (functionName, parameters) {
			parameters.forEach(function (parameter) {
				var isParameterNullOrUndefined = parameter.value === null || parameter.value === undefined;
				var isParameterOfWrongType = !parameter.expected.find(function (type) {
					return type === this.typeOf(parameter.value) || parameter.value && parameter.value.getMetadata && parameter.value.isA(type);
				}.bind(this));
				var errorMessage = "";

				if (isParameterNullOrUndefined) {
					errorMessage = this.replaceByIndex("@ {0}: mandatory parameter \"{1}\" not provided.", [
						functionName,
						parameter.name
					]);
				}else if (isParameterOfWrongType) {
					errorMessage = this.replaceByIndex(
						"@ {0}: mandatory parameter \"{1}\" is of wrong type: \"{2}\" expected, \"{3}\" provided.", [
							functionName,
							parameter.name,
							parameter.expected.join("|"),
							this.typeOf(parameter.value)
						]);
				}

				if (errorMessage) {
					throw new Error(errorMessage);
				}
			}.bind(this));
		},
		/**
		 * Creates an object basing from the given path.
		 * 
		 * @param	{string}	path			The path to translate.
		 * @param	{*}			[value]			The value tp assign at the end of translation.
		 * @param	{string}	[separator]=/	The character to use as separator for splitting the path.
		 * 
		 * @returns	{object}					The created object.
		 */
		createObjectByPath: function(path, value, separator){
			this.checkParameters("createObjectByPath", [{
				name: "path",
				value: path,
				expected: ["string"]
			}]);
			
			var pathParts = path.split(separator || "/").filter(function (x) {
				return !!x;
			});
			var nestedData = pathParts.reduceRight(function (acc, item) {
				return Object.defineProperty({}, item, {
					value: acc,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}, value === undefined ? {} : value);
			
			return nestedData;
		},
		/**
		 * Returns an object by its path.
		 * 
		 * @param	{string}	path			The path of the object (e.g. sap.ui.model.type.Float).
		 * @param	{object}	[separor]=/		The character to use as separator for splitting the path.
		 * @param	{object}	[scope]=window	The scope from which begin the research.
		 * 
		 * @returns	{object}					The founded object.
		 */
		getObjectByPath: function (path, separator, scope) {
			this.checkParameters("getObjectByPath", [{
				name: "path",
				value: path,
				expected: ["string"]
			}]);

			var parts = path.split(separator || "/");

			scope = scope || window;

			for (var i = 0; i < parts.length; ++i) {
				scope = scope[parts[i]];
			}

			return scope;
		},
		/**
		 * Returns an object property by its index.
		 * 
		 * @param	{object}	object		The Object containing the property.
		 * @param	{int}		[index]=0	The index of the property.
		 * 
		 * @returns {value} 				The value of the property.
		 */
		getObjectPropertyByIndex: function (object, index) {
			this.checkParameters("getPropertyByIndex", [{
				name: "object",
				value: object,
				expected: ["object"]
			}]);

			index = index || 0;

			var objectKeys = Object.keys(object);

			return object[objectKeys[index]];
		},
		/** 
		 * Parses a formatted float or integer (e.g 1.234,5).
		 * 
		 * @param	{string|number}	value	The number to parse.
		 * 
		 * @returns {number}				The parsed number.
		 */
		parseFormattedNumber: function (value) {
			this.checkParameters("parseFormattedNumber", [{
				name: "value",
				value: value,
				expected: ["string", "number"]
			}]);

			var type = this.typeOf(value);
			var parser = new sap.ui.model.type.Float();

			return type === "string" ? parser.parseValue(value, "string") : value;
		},
		/** 
		 * Parses an XML string, optionally returning the value of a specified node.
		 * 
		 * @param	{string}	xml			The XML string to parse. 
		 * @param	{string}	nodeName	The tag to be red.
		 * 
		 * @returns {string}				The value of the node with specified nodeName.
		 */
		parseXml: function (xml, nodeName) {
			this.checkParameters("xml", [{
				name: "xml",
				value: xml,
				expected: ["string"]
			}, {
				name: "nodeName",
				value: nodeName,
				expected: ["string"]
			}]);

			var parsed = new DOMParser().parseFromString(xml, "text/xml");

			parsed = (parsed.querySelector(nodeName) || parsed.querySelector("h1") || {}).innerHTML;

			return parsed;
		},
		/**
		 * Replaces string placeholders (e.g. {0}, {1}, ...{n}) with array values in the same positions.
		 * 
		 * @param	{string}	templateString	The template string.
		 * @param	{array}		values			The array of values to replace placeholders.
		 * 
		 * @returns {string}					The completed string.
		 */
		replaceByIndex: function (templateString, values) {
			this.checkParameters("replaceByIndex", [{
				name: "templateString",
				value: templateString,
				expected: ["string"]
			}, {
				name: "values",
				value: values,
				expected: ["array"]
			}]);

			values.forEach(function (value, i) {
				var placeHolder = "{" + i + "}";

				if (templateString.indexOf(placeHolder) > -1) {
					templateString = templateString.replace(placeHolder, value);
				}
			});

			return templateString;
		},
		/** 
		 * Checks the type of the given value.
		 * 
		 * @param	{*}			[value]	The value whose type needs to be found.
		 * 
		 * @returns	{string}			The type of the value. For UI5 controls the UI5 control type will be returned.
		 */
		typeOf: function (value) {
			var type = typeof value;

			if (type === "object" && value !== null) {
				if (value instanceof Array) {
					type = "array";
				}
				if (value instanceof Date) {
					type = "date";
				}
				if (value.getMetadata) {
					type = value.getMetadata()._sClassName;
				}
			}

			return type;
		}
	};
});