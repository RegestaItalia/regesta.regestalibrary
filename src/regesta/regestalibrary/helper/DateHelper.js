/** 
 * Date helper functions.
 * 
 * @class regesta.regestalibrary.helper.DateHelper
 * @memberof regesta.regestalibrary.helper
 * @hideconstructor
 */

sap.ui.define([
	"regesta/regestalibrary/enum/TimeUom",
	"regesta/regestalibrary/helper/JsHelper"
], function (TimeUom, JsHelper) {
	"use strict";

	return {
		/**
		 * Shorthand: calls addTime for adding days to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addDays: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Day);
		},
		/**
		 * Shorthand: calls addTime for adding hours to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addHours: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Hour);
		},
		/**
		 * Shorthand: calls addTime for adding minutes to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addMinutes: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Minute);
		},
		/**
		 * Shorthand: calls addTime for adding months to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addMonths: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Month);
		},
		/**
		 * Shorthand: calls addTime for adding seconds to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addSeconds: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Second);
		},
		/** 
		 * Adds time of specified unit of measure to existing date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 * 
		 * @param	{date}		date	The starting date. 
		 * @param	{integer}	time	The amount of time to be added. Note that it can be either positive or negative. 
		 * @param	{string}	uom 	The unit of measure ({@link TimeUom}) of the specified amount of time.
		 * 
		 * @returns {date}				The resulting date (original one is unmodified).
		 */
		addTime: function (date, time, uom) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}, {
				name: "uom",
				value: uom,
				expected: ["string"]
			}]);

			switch (uom) {
			case TimeUom.Second:
				return new Date(new Date(date).setSeconds(date.getSeconds() + time));
			case TimeUom.Minute:
				return new Date(new Date(date).setMinutes(date.getMinutes() + time));
			case TimeUom.Hour:
				return new Date(new Date(date).setHours(date.getHours() + time));
			case TimeUom.Day:
				return new Date(new Date(date).setDate(date.getDate() + time));
			case TimeUom.Month:
				return new Date(new Date(date).setMonth(date.getMonth() + time));
			case TimeUom.Year:
				return new Date(new Date(date).setFullYear(date.getFullYear() + time));
			default:
				return null;
			}
		},
		/**
		 * Shorthand: calls addTime for adding years to date.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 */
		addYears: function (date, time) {
			JsHelper.checkParameters("addTime", [{
				name: "date",
				value: date,
				expected: ["date"]
			}, {
				name: "time",
				value: time,
				expected: ["number"]
			}]);

			return this.addTime(date, time, TimeUom.Year);
		},
		/**
		 * Return the end of given date's month.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 * 
		 * @èaram	{date}	date	The starting date.
		 * 
		 * @returns {date}	The 	resulting date (original one is unmodified).
		 */
		endOfMonth: function (date) {
			JsHelper.checkParameters("removeTimeZoneOffset", [{
				name: "date",
				value: date,
				expected: ["date"]
			}]);

			var newDate = this.startOfMonth(date);

			newDate = this.addTime(newDate, 1, TimeUom.Month);

			return this.addTime(newDate, -1, TimeUom.Day);
		},
		/** 
		 * Removes given date gmt's corresponding amount of time (e.g. gmt+1 = -60 minutes) from it.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 * 
		 * @param	{date}		date		The starting date.
		 * @param	{boolean}	add=false	If true, the timezone will be added instead of being removed.
		 * 
		 * @returns {date}					The resulting date (original one is unmodified).
		 */
		removeTimeZoneOffset: function (date, add) {
			JsHelper.checkParameters("removeTimeZoneOffset", [{
				name: "date",
				value: date,
				expected: ["date"]
			}]);

			var timeZoneOffset = date.getTimezoneOffset();

			return this.addTime(date, add ? -timeZoneOffset : timeZoneOffset, TimeUom.Minute);
		},
		/**
		 * Return the start of given date's month.
		 * 
		 * @memberof regesta.regestalibrary.helper.DateHelper
		 * 
		 * @èaram	{date}	date	The starting date.
		 * 
		 * @returns {date}			The resulting date (original one is unmodified).
		 */
		startOfMonth: function (date) {
			JsHelper.checkParameters("removeTimeZoneOffset", [{
				name: "date",
				value: date,
				expected: ["date"]
			}]);

			var newDate = new Date(date.valueOf());

			return new Date(newDate.setDate(1));
		}
	};
});