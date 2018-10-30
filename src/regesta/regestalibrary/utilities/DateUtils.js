sap.ui.define([], function () {
	"use strict";
	var DateUtils = {};

	DateUtils.addTime = function (date, time, uom) {
		if (!date || !time || !uom) {
			throw ("Missing parameter for DateUtils.addTime");
		}

		switch (uom) {
		case "s":
			return new Date(new Date(date).setSeconds(date.getSeconds() + time));
		case "m":
			return new Date(new Date(date).setMinutes(date.getMinutes() + time));
		case "h":
			return new Date(new Date(date).setHours(date.getHours() + time));
		case "d":
			return new Date(new Date(date).setDate(date.getDate() + time));
		case "M":
			return new Date(new Date(date).setMonth(date.getMonth() + time));
		case "y":
			return new Date(new Date(date).setFullYear(date.getFullYear() + time));
		default:
			return null;
		}
	};

	return DateUtils;
});