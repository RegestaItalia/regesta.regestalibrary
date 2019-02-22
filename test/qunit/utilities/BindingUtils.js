sap.ui.require(
	[
		"regesta/regestalibrary/utilities/BindingUtils",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (BindingUtils, ResourceModel) {
		"use strict";

		QUnit.test("No original filters in binding -> filters: [newFilter]", function (assert) {
			var binding = {
				filters: []
			};

			var newFilter = new sap.ui.model.Filter({
				path: "Example",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: 1
			});

			var expectedBinding = {
				filters: [newFilter]
			};

			BindingUtils.updateBindingParamsFilter(binding, newFilter);
			assert.deepEqual(binding, expectedBinding);
		});

		QUnit.test("One filter with subfilters in AND -> filters: [{ bAnd: true, filters: [sf1, sf2, newFilter] }]", function (assert) {

			var originalFilter = new sap.ui.model.Filter({
				bAnd: true,
				filters: [
					new sap.ui.model.Filter({
						path: "Example",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: 1
					}),
					new sap.ui.model.Filter({
						path: "Example2",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: 2
					})
				]
			});

			var newFilter = new sap.ui.model.Filter({
				path: "Example3",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: 3
			});

			var expectedFilter = new sap.ui.model.Filter({
				bAnd: true,
				filters: [
					new sap.ui.model.Filter({
						path: "Example",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: 1
					}),
					new sap.ui.model.Filter({
						path: "Example2",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: 2
					}),
					newFilter
				]
			});

			var binding = {
				filters: [originalFilter]
			};

			var expectedBinding = {
				filters: [expectedFilter]
			};

			BindingUtils.updateBindingParamsFilter(binding, newFilter);
			assert.deepEqual(binding, expectedBinding);
		});

		QUnit.test("One filter with subfilters in OR -> filters: [{ bAnd: true, filters: [{bAnd: false, filters: [sf1,sf2] }, newFilter] }]",
			function (assert) {
				var originalFilter = new sap.ui.model.Filter({
					bAnd: false,
					filters: [
						new sap.ui.model.Filter({
							path: "Example",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: 1
						}),
						new sap.ui.model.Filter({
							path: "Example2",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: 2
						})
					]
				});

				var newFilter = new sap.ui.model.Filter({
					path: "Example3",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: 3
				});

				var expectedFilter = new sap.ui.model.Filter({
					bAnd: true,
					filters: [
						new sap.ui.model.Filter({
							bAnd: false,
							filters: [
								new sap.ui.model.Filter({
									path: "Example",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: 1
								}),
								new sap.ui.model.Filter({
									path: "Example2",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: 2
								})
							]
						}),
						newFilter
					]
				});

				var binding = {
					filters: [originalFilter]
				};

				var expectedBinding = {
					filters: [expectedFilter]
				};

				BindingUtils.updateBindingParamsFilter(binding, newFilter);
				assert.deepEqual(binding, expectedBinding);
			});

		QUnit.test("More than one filter at root level (implicit OR) -> filters: [{ bAnd: true, filters: [{ filters: [f1,f2] }, newFilter] }]",
			function (assert) {
				var firstFilter = new sap.ui.model.Filter({
					path: "Example1",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: 1
				});

				var secondFilter = new sap.ui.model.Filter({
					path: "Example2",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: 2
				});

				var newFilter = new sap.ui.model.Filter({
					path: "Example3",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: 3
				});

				var expectedFilter = new sap.ui.model.Filter({
					bAnd: true,
					filters: [
						new sap.ui.model.Filter({
							filters: [
								firstFilter,
								secondFilter
							]
						}),
						newFilter
					]
				});

				var binding = {
					filters: [firstFilter, secondFilter]
				};

				var expectedBinding = {
					filters: [expectedFilter]
				};

				BindingUtils.updateBindingParamsFilter(binding, newFilter);
				assert.deepEqual(binding, expectedBinding);
			});

		QUnit.test("Mandatory field missing in function call", function (assert) {
			try {
				BindingUtils.checkParameters("afterNavigate", [{
					name: "context",
					value: null
				}]);
				assert.ok(false);
			} catch (exc) {
				assert.ok(true);
			}
		});

		QUnit.test("Mandatory field provided in function call", function (assert) {
			try {
				BindingUtils.checkParameters("afterNavigate", [{
					name: "context",
					value: "value"
				}]);
				assert.ok(true);
			} catch (exc) {
				assert.ok(false);
			}
		});
	}
);