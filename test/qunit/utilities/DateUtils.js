sap.ui.require(
	[
		"regesta/regestalibrary/utilities/DateUtils",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (DateUtils, ResourceModel) {
		"use strict";

		QUnit.test("Adding 1 second to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1988, 12, 28, 0, 0, 1);

			var newDate = DateUtils.addTime(startDate, 1, "s");
			assert.deepEqual(newDate, expectedDate);
		});

		QUnit.test("Adding 1 minute to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1988, 12, 28, 0, 1, 0);

			var newDate = DateUtils.addTime(startDate, 1, "m");
			assert.deepEqual(newDate, expectedDate);
		});

		QUnit.test("Adding 1 hour to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1988, 12, 28, 1, 0, 0);

			var newDate = DateUtils.addTime(startDate, 1, "h");
			assert.deepEqual(newDate, expectedDate);
		});

		QUnit.test("Adding 1 day to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1988, 12, 29, 0, 0, 0);

			var newDate = DateUtils.addTime(startDate, 1, "d");
			assert.deepEqual(newDate, expectedDate);
		});

		QUnit.test("Adding 1 month to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1989, 1, 28, 0, 0, 0);

			var newDate = DateUtils.addTime(startDate, 1, "M");
			assert.deepEqual(newDate, expectedDate);
		});

		QUnit.test("Adding 1 year to specified date", function (assert) {
			var startDate = new Date(1988, 12, 28, 0, 0, 0);
			var expectedDate = new Date(1989, 12, 28, 0, 0, 0);

			var newDate = DateUtils.addTime(startDate, 1, "y");
			assert.deepEqual(newDate, expectedDate);
		});
	}
);