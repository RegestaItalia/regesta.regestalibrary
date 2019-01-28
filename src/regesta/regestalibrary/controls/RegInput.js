/*!
 * ${copyright}
 */
// Provides control regesta.regestalibrary.RegInput.
sap.ui.define(["jquery.sap.global", "./../library", "sap/m/Input"],
	function (jQuery, library, Input) {
		"use strict";

		var RegInput = Input.extend("regesta.regestalibrary.controls.RegInput", {
			metadata: {
				library: "regesta.regestalibrary",
				properties: {
					"regType": {
						type: "string",
						defaultValue: false
					}
				}
			},

			renderer: {},

			onkeydown: function (oEvent) {
				if (!this.isSpecialKey(oEvent.key)) {
					switch (this.getRegType()) {
					case "Integer":
						this.validateInteger(oEvent);
						break;
					}
				} else {
					Input.prototype.onkeydown.apply(this, arguments);
				}
			},

			isSpecialKey: function (oKey) {
				return oKey.length > 1;
			},

			validateInteger: function (oEvent) {
				if (oEvent.key === "Backspace" || !isNaN(parseInt(oEvent.key, 10))) {
					Input.prototype.onkeydown.apply(this, arguments);
				} else {
					oEvent.preventDefault();
				}
			}
		});

		return RegInput;
	}, /* bExport= */ true);