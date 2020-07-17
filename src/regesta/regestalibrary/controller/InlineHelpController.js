sap.ui.define([
	"sap/ui/base/Object",
	// "sap/base/Log",
	"regesta/regestalibrary/control/inlineHelp/InlineHelpPopover",
	"sap/ui/core/Fragment"
// ], function (UI5Object, Log, InlineHelpinlineHelpPopover, Fragment) {
], function (UI5Object, InlineHelpinlineHelpPopover, Fragment) {
	"use strict";
	return UI5Object.extend("regesta.regestalibrary.controller.InlineHelpController", function InlineHelpController() {
		var _oView = null;
		var _oDOMContext = null;
		var _sSaveFunctionName = "";
		var _lastClickedUi5Control = "";
		//var _oUser = null; //TODO: implement user checks
		var _getElementUnderTest = function (target) {
			var aUnderTestElementControl = null;
			try {
				var oActiveElement = jQuery(target);
				if (oActiveElement) {
					aUnderTestElementControl = oActiveElement.control();
				}
			} catch (err) {
				// Log.error(err);
			}
			return aUnderTestElementControl && aUnderTestElementControl.length > 0 ? aUnderTestElementControl[0] : null;
		};

	 	var _isPageInEditMode = function(){
	 		return _oView.getModel("ui").getProperty("/editable");
	 	};

		var _disablePointerEvents = function () {
			_oDOMContext.style["pointer-events"] = "none";
		};

		var _enablePointerEvents = function () {
			_oDOMContext.style["pointer-events"] = "auto";
		};
		
		var _onMouseDown = function (oEvent){
			console.log("MouseDown", oEvent.target.id);
			_lastClickedUi5Control = _getElementUnderTest(oEvent.target);
		};

		var _onF1KeyPress = function (oEvent) {
			if (oEvent.key === "F1") {
				console.log("_onF1KeyPress")
				oEvent.preventDefault();
				var oUi5Control = null;
				// if (_isPageInEditMode()){
				// 	oUi5Control = _getElementUnderTest(oEvent.target); 
				// } else {
				// 	console.log("other control")
				// 	oUi5Control = _lastClickedUi5Control;
				// }
				oUi5Control = _lastClickedUi5Control;
				if (oUi5Control) {
					if (!this.inlineHelpPopover) {
						this.inlineHelpPopover = new InlineHelpinlineHelpPopover({
							ui5Control: oUi5Control,
							sSaveFunctionName: _sSaveFunctionName
								//oUser: //TODO: implement user checks
						});
						var popup = this.inlineHelpPopover.getInternalPopup();
						popup.attachAfterOpen(function () {
							_disablePointerEvents();
						}, this);
						popup.attachAfterClose(function () {
							_enablePointerEvents();
						}, this);
						_oView.addDependent(this.inlineHelpPopover);
					} else {
						this.inlineHelpPopover.setUi5Control(oUi5Control);
					}
					console.log("Is up to date:", this.inlineHelpPopover.getIsUpToDate())
					if (this.inlineHelpPopover.getIsUpToDate()){  //Popup is shown only if info are up to date
						this.inlineHelpPopover.openHelp();
					}
				}
			}
		};
		var _PreventF1 = function () {
			document.addEventListener("keydown", function (oEvent) {
				if (oEvent.key === "F1") {
					oEvent.preventDefault();
				}
			});
		};

		return {
			constructor: function (oParents) {
				_oView = oParents.oView;
				_oDOMContext = _oView.getDomRef();
				_sSaveFunctionName = oParents.sSaveFunctionName;
				_onF1KeyPress = _onF1KeyPress.bind(this);
				_onMouseDown = _onMouseDown.bind(this);
				_getElementUnderTest = _getElementUnderTest.bind(this);
			},
			start: function () {
				_PreventF1();
				_oDOMContext.addEventListener("keydown", _onF1KeyPress);
				_oDOMContext.addEventListener("mousedown", _onMouseDown);
			},
			stop: function () {
				_oDOMContext.removeEventListener("keydown", _onF1KeyPress);
			}
		};
	}());
});