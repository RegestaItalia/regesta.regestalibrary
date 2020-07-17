sap.ui.require(
	[
		"regesta/regestalibrary/controls/RegInput",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (RegInput, ResourceModel) {
		"use strict";

		QUnit.test("Should create a new RegInput object", function (assert) {
			var oRegInput = new RegInput({
					regType: "Integer"
			});
			
			assert.equal(oRegInput.getRegType(),"Integer"); 
		});
	}
);