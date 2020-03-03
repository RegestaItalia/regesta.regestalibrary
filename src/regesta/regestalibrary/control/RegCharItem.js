/**
 * Provides control regesta.regestalibrary.RegCharItem.
 * 
 * @member RegCharItem
 * @memberof regesta.regestalibrary.control
 */

sap.ui.define(["jquery.sap.global",
		"./../library",
		"sap/ui/core/Control"
	],

	function (jQuery, library, Control) {
		"use strict";

		var RegCharItem = Control.extend("regesta.regestalibrary.control.RegCharItem", {
			metadata: {
				library: "regesta.regestalibrary",

				properties: {
					"group": {
						type: "string",
						defaultValue: "groupKey"
					},
					"name": {
						type: "string",
						defaultValue: "charName"
					},
					"value": {
						type: "string",
						defaultValue: "charValue"
					},
					"description": {
						type: "string",
						defaultValue: "descrValue"
					}
				},
			},

			init: function () {

			},

			renderer: {
				render: function (oRm, oControl) {}
			},
		});

		return RegCharItem;
	}, /* bExport= */ true);