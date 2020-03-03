/**
 * @file	Custom integer type with handling of blank values. It's an extension of the standard sap.ui.model.type.Integer type.
 */

sap.ui.define([
	"sap/ui/model/SimpleType"
], function (SimpleType) {
	"use strict";
	return SimpleType.extend("regesta.regestalibrary.type.Integer", {
		formatValue: function (value, externalValue) {
			if (value || value == 0) { // eslint-disable-line eqeqeq
				return new sap.ui.model.type.Integer(this.oFormatOptions, this.oConstraints).formatValue(value, externalValue);
			}

			return null;
		},
		parseValue: function (value, internalType) {
			try {
				return new sap.ui.model.type.Integer(this.oFormatOptions, this.oConstraints).parseValue(value, internalType);
			} catch (exc) {
				return value;
			}
		},
		validateValue: function (value) {
			if (value && parseInt(value) !== value) { // eslint-disable-line radix
				throw new sap.ui.model.ParseException();
			}

			return value;
		}
	});
});