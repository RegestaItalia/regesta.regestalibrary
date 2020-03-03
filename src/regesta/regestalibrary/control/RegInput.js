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
					case "Decimal":
						this.validateDecimal(oEvent);
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
			},

			validateDecimal: function (oEvent) {
				if (oEvent.key === "Backspace" || !isNaN(parseInt(oEvent.key, 10)) || this.checkSingleComma(oEvent.key)) {
					Input.prototype.onkeydown.apply(this, arguments);
				} else {
					oEvent.preventDefault();
				}
			},
			
			checkSingleComma: function (oKey){
				if(oKey !== "."){
					return false;
				}
				
				if(this.getValue().indexOf(".") !== -1)
					return false;
				
				return true;
			}
		});

		return RegInput;
	}, /* bExport= */ true);