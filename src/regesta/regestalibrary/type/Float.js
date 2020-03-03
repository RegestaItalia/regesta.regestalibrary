/**
 * Custom float type with handling of blank values. It's an extension of the standard sap.ui.model.type.Float type.
 * 
 * @module Float
 */

sap.ui.define([
	"sap/ui/model/SimpleType"
], function (SimpleType) {
	"use strict";
	return SimpleType.extend("regesta.regestalibrary.type.Float", {
		formatValue: function (value, externalValue) {
			if (value || value == 0) { // eslint-disable-line eqeqeq
				return new sap.ui.model.type.Float(this.oFormatOptions, this.oConstraints).formatValue(value, externalValue);
			}

			return null;
		},
		parseValue: function (value, internalType) {
			try {
				return new sap.ui.model.type.Float(this.oFormatOptions, this.oConstraints).parseValue(value, internalType);
			} catch (exc) {
				return value;
			}
		},
		validateValue: function (value) {
			if (value && parseFloat(value) !== value) {
				throw new sap.ui.model.ParseException();
			}

			return value;
		}
	});
});