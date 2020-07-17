sap.ui.require(
	[
		"regesta/regestalibrary/controls/RegSmartTable",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (RegSmartTable, ResourceModel) {
		"use strict";

		QUnit.test("Should create a new RegSmartTable object", function (assert) {
			var oRegSmartTable = new RegSmartTable({
					exportVisibleColumns: "true"
			});
			
			assert.equal(oRegSmartTable.getExportVisibleColumns(),"true"); 
		});
	}
);