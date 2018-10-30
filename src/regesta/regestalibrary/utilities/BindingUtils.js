sap.ui.define([], function() {
	"use strict";
	var BindingUtils = {};

	BindingUtils.updateBindingParamsFilter = function(bindingParams, newFilter) {
		if (!bindingParams.filters || bindingParams.filters.length === 0) {
			bindingParams.filters = [newFilter];
		} else if (bindingParams.filters.length === 1) {
			if (bindingParams.filters[0].bAnd === true) {
				bindingParams.filters[0].aFilters.push(newFilter);
			} else {
				var oldFilter = bindingParams.filters[0];
				bindingParams.filters[0] = new sap.ui.model.Filter({
					and: true,
					filters: [oldFilter, newFilter]
				});
			}
		} else {
			var oldFilters = new sap.ui.model.Filter({
				and: false,
				filters: bindingParams.filters
			});

			bindingParams.filters = [ new sap.ui.model.Filter({
				and: true,
				filters: [oldFilters, newFilter]
			}) ];
		}
	};
	
	BindingUtils.alignDateTimeFilter = function(filter) {
		if (filter.aFilters !== null && filter.aFilters !== undefined && filter.aFilters.length > 0) {
			for (var i = 0; i < filter.aFilters.length; i++) {
				this.alignDateTimeFilter(filter.aFilters[i]);
			}
		} else {
			if (filter.oValue1 instanceof Date) {
				var oOffsetValue1 = filter.oValue1.getTimezoneOffset();
				filter.oValue1 = new Date(filter.oValue1 - oOffsetValue1 * 60 * 1000);
			}
			if (filter.oValue2 instanceof Date) {
				var oOffsetValue2 = filter.oValue2.getTimezoneOffset();
				filter.oValue2 = new Date(filter.oValue2 - oOffsetValue2 * 60 * 1000);
			}
		}
	};

	return BindingUtils;
});