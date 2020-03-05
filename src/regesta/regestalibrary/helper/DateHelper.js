// /**
//  * @file	Date-related helper functions.
//  */

// sap.ui.define([
// 	"./Commons",
// 	"regesta/regestalibrary/enum/TimeUom"
// ], function () {
// 	"use strict";

// 	return {
// 		// /** 
// 		//  * Adds time of specified unit of measure to existing date.
// 		//  * 
// 		//  * @param {date} date The starting date. 
// 		//  * @param {integer} time The amount of time to be added. Note that it can be either positive or negative. 
// 		//  * @param {string} uom The unit of measure ({@link TimeUom}) of the specified amount of time.
// 		//  * 
// 		//  * @returns {date} The resulting date (original one is unmodified).
// 		//  */
// 		// addTime: function (date, time, uom) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}, {
// 		// 		name: "uom",
// 		// 		value: uom,
// 		// 		expected: ["string"]
// 		// 	}]);

// 		// 	switch (uom) {
// 		// 	case TimeUom.Second:
// 		// 		return new Date(new Date(date).setSeconds(date.getSeconds  () + time));
// 		// 	case TimeUom.Minute:
// 		// 		return new Date(new Date(date).setMinutes(date.getMinutes() + time));
// 		// 	case TimeUom.Hour:
// 		// 		return new Date(new Date(date).setHours(date.getHours() + time));
// 		// 	case TimeUom.Day:
// 		// 		return new Date(new Date(date).setDate(date.getDate() + time));
// 		// 	case TimeUom.Month:
// 		// 		return new Date(new Date(date).setMonth(date.getMonth() + time));
// 		// 	case TimeUom.Year:
// 		// 		return new Date(new Date(date).setFullYear(date.getFullYear() + time));
// 		// 	default:
// 		// 		return null;
// 		// 	}
// 		// },
// 		// /**
// 		//  * Return the end of given date's month.
// 		//  * 
// 		//  * @èaram {date} date The starting date.
// 		//  * 
// 		//  * @returns {date} The resulting date (original one is unmodified).
// 		//  */
// 		// endOfMonth: function(date){
// 		// 	Commons.checkParameters("removeTimeZoneOffset", [{
// 		// 		name: "date", 
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}]);
			
// 		// 	var newDate = this.startOfMonth(date);                  
			
// 		// 	newDate = this.addTime(newDate, 1, TimeUom.Month);                  
			
// 		// 	return this.addTime(newDate, -1, TimeUom.Day);
// 		// },
// 		// /** 
// 		//  * Removes given date gmt's corresponding amount of time (e.g. gmt+1 = -60 minutes) from it.
// 		//  * 
// 		//  * @param {date} date The starting date.
// 		//  * @param {boolean} add=false If true, the timezone will be added instead of being removed.
// 		//  * 
// 		//  * @returns {date} The resulting date (original one is unmodified).
// 		//  */
// 		// removeTimeZoneOffset: function (date, add) {
// 		// 	Commons.checkParameters("removeTimeZoneOffset", [{
// 		// 		name: "date", 
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}]);
			
// 		// 	var timeZoneOffset = date.getTimezoneOffset();

// 		// 	return this.addTime(date, add ? -timeZoneOffset : timeZoneOffset, TimeUom.Minute);
// 		// },
// 		// /**
// 		//  * Return the start of given date's month.
// 		//  * 
// 		//  * @èaram {date} date The starting date.
// 		//  * 
// 		//  * @returns {date} The resulting date (original one is unmodified).
// 		//  */
// 		// startOfMonth: function(date){
// 		// 	Commons.checkParameters("removeTimeZoneOffset", [{
// 		// 		name: "date", 
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}]);
			
// 		// 	var newDate = new Date(date.valueOf());
			
// 		// 	return new Date(newDate.setDate(1));
// 		// },
		
// 		// // new >>
// 		// addDays: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Day);
// 		// },
// 		// addHours: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Hour);
// 		// },
// 		// addMinutes: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Minute);
// 		// },
// 		// addMonths: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Month);
// 		// },
// 		// addSeconds: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Second);
// 		// },
// 		// addYears: function (date, time) {
// 		// 	Commons.checkParameters("addTime", [{
// 		// 		name: "date",
// 		// 		value: date,
// 		// 		expected: ["date"]
// 		// 	}, {
// 		// 		name: "time",
// 		// 		value: time,
// 		// 		expected: ["number"]
// 		// 	}]);

// 		// 	return this.addTime(date, time, TimeUom.Year);
// 		// },
// 		// // new <<
// 	};
// });