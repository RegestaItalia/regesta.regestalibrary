sap.ui.require(
	[
		"regesta/regestalibrary/formatters/NumberFormatter",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (NumberFormatter, ResourceModel) {
		"use strict";

		QUnit.test("Should return a number with 3 digits", function (assert) {
			var number = 3.14159265359;
			var expectedNumber = 3.142;
			var parsedNumber = NumberFormatter.threeDecimals(number);
			
			assert.equal(parsedNumber,expectedNumber); 
		});
		
		QUnit.test("Should return a number with 2 digits", function (assert) {
			var number = 3.14159265359;
			var expectedNumber = 3.14;
			var parsedNumber = NumberFormatter.twoDecimals(number);
			
			assert.equal(parsedNumber,expectedNumber); 
		});
		
		QUnit.test("Should return a number with 1 digits", function (assert) {
			var number = 3.14159265359;
			var expectedNumber = 3.1;
			var parsedNumber = NumberFormatter.oneDecimal(number);
			
			assert.equal(parsedNumber,expectedNumber); 
		});
		
		QUnit.test("Should return an integer", function (assert) {
			var number = 3.14159265359;
			var expectedNumber = 3;
			var parsedNumber = NumberFormatter.noDecimals(number);
			
			assert.equal(parsedNumber,expectedNumber); 
		});
	}
);