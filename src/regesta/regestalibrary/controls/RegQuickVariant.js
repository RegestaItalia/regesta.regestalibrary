/*!
 * ${copyright}
 */
// Provides control regesta.regestalibrary.RegQuickVariant

sap.ui.define(["jquery.sap.global",
		"./../library",
		"sap/ui/core/Control"
	],

	function (jQuery, library, Control) {
		"use strict";

		var RegQuickVariant = Control.extend("regesta.regestalibrary.controls.RegQuickVariant", {
			metadata: {
				library: "regesta.regestalibrary",

				properties: {
					"icon": {
						type: "string",
						defaultValue: ""
					},
					"text": {
						type: "string",
						defaultValue: ""
					},
					"annotationPath": {
						type: "string",
						defaultValue: ""
					}
				}
			},

			init: function () {

			},

			renderer: {
				render: function (oRm, oControl) {}
			}
		});

		return RegQuickVariant;
	}, /* bExport= */ true);