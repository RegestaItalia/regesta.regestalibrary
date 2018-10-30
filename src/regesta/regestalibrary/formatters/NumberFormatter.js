sap.ui.define([], function() {
	"use strict";
	var numberFormatter = {};

	numberFormatter.round = function(number, decimals) {
		if (number && !isNaN(number)) {
			return Number(Math.round(number + "e" + decimals) + "e-" + decimals); //Esponenziale per evitare perdita precisione data da floating point
		}
		
		return number;
	};

	numberFormatter.threeDecimals = function(number) {
		return numberFormatter.round(number, 3);
	};
	numberFormatter.twoDecimals = function(number) {
		return numberFormatter.round(number, 2);
	};
	numberFormatter.oneDecimal = function(number) {
		return numberFormatter.round(number, 1);
	};
	numberFormatter.noDecimals = function(number) {
		return numberFormatter.round(number, 0);
	};

	return numberFormatter;
});