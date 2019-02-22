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
	
	DateUtils.addWorkingDays = function (startDate, days) {
		//Checks
		if (isNaN(days)) {
			throw new Error("Value provided for \"days\" is not a number");
		}
		if (!(startDate instanceof Date)) {
			throw new Error("Value provided for \"startDate\" is not a javascript Date object");
		}
		var parsedDays = parseInt(days, 10);
		var day = startDate.getDay();
		
		//intra week correction
		var weekCorrection = day === 6 ? 2 : +!day; //sab +2, dom +1 else +0
		
		//weekends correction
		var weekendsCorrection = 2 * Math.floor((parsedDays - 1 + (day % 6 || 1)) / 5);  //Nb: sab,dom e lun contano uguale per la correzione al passo precedente
		
		//Total amount of days
		var daysTot = parsedDays + weekCorrection + weekendsCorrection;
		
		var calcDate = new Date(startDate.getTime());
		calcDate.setDate(startDate.getDate() + daysTot);
		return calcDate;
	};

	return DateUtils;
});