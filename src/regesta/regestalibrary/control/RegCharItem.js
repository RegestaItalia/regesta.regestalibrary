/*!
 * ${copyright}
 */
// Provides control regesta.regestalibrary.RegCharItem

sap.ui.define(["jquery.sap.global",
		"./../library",
		"sap/ui/core/Control"
	],

	function (jQuery, library, Control) {
		"use strict";

		var RegCharItem = Control.extend("regesta.regestalibrary.controls.RegCharItem", {
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