sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/statusindicator/PropertyThreshold"
], function (UI5Object, Fragment, JSONModel, PropertyThreshold) {
	"use strict";
	return UI5Object.extend("regesta.regestalibrary.control.WebSocketMessage.ProgressWithMessages.ProgressWithMessages",
		function ProgressWithMessages() {
			var _oModel = null;
			var _oProgressIndicatorElement = null;

			var _bRunning = false;

			var _at0 = null;
			var _at100 = null;
			var _onError = null;

			var _bThreshold = false;
			var _aThresholds = [{
				FillColor: "Error",
				ToValue: 33
			}, {
				FillColor: "Critical",
				ToValue: 60
			}, {
				FillColor: "Good",
				ToValue: 100
			}];

			var _LoadStatusIndicator = function () {
				_oProgressIndicatorElement = sap.ui.xmlfragment(
					"regesta.regestalibrary.control.WebSocketMessage.ProgressWithMessages.ProgressWithMessages");
				_oProgressIndicatorElement.setModel(_oModel, "Progress");
				if(_bThreshold){
					var oStatusIndicator = _oProgressIndicatorElement.getItems().find(function(oItems){
						return oItems instanceof sap.suite.ui.commons.statusindicator.StatusIndicator;
					});
					
					_aThresholds.forEach(function(oThreshold){
						oStatusIndicator.addPropertyThreshold(new PropertyThreshold({
							fillColor: oThreshold.FillColor,
							toValue: oThreshold.ToValue
						}));
					});
				}
				/*return Fragment.load({
					name: "regesta.regestalibrary.control.WebSocketMessage.ProgressWithMessages.ProgressWithMessages",
					controller: this
				}).then(function (oFlexBox) {
					oFlexBox.setModel(_oModel, "Progress");
					_oProgressIndicatorElement = oFlexBox;
				});*/
			};

			return {
				constructor: function (oParameters) {
					oParameters = oParameters || {};

					_oModel = new JSONModel({
						Status: {
							Percentages: null,
							Message: ""
						},
						//StatusIndicator Costumization
						ShapeID: oParameters.ShapeId || "circle",
						FillColor: oParameters.FillColor || "Neutral",
						ShowProgressLabel: typeof oParameters.ShowProgressLabel === "boolean" ? oParameters.ShowProgressLabel : true,
						ProgressLabelPosition: oParameters.LabelPosition || "Bottom",
						//FlexBox Costumization
						Witdh: oParameters.Witdh || "auto",
						Height: oParameters.Height || "auto",
						ContentDirection: oParameters.ContentDirection || "Column"
					});

					_bThreshold = oParameters.bThreshold || _bThreshold;
					_aThresholds = oParameters.aThresholds || _aThresholds;

					_at0 = oParameters.at0 || _at0;
					_at100 = oParameters.at100 || _at100;
					_onError = oParameters.onError || _onError;

					/*await*/
					_LoadStatusIndicator.call(this);
				},

				getProgressIndicatorElement: function () {
					return _oProgressIndicatorElement;
				},

				onStatusValuesChange: function (oSatatus) {
					_oModel.setProperty("/Status", oSatatus);
					if (oSatatus.Percentages == 0 && !_bRunning) {
						this.at0(oSatatus.Message);
					}
					if (oSatatus.Percentages == 100 && _bRunning) {
						this.at100(oSatatus.Message);
					}
				},

				onError: function (oError) {
					if (_onError) {
						_onError();
					}
					_bRunning = _bRunning ? false : _bRunning;
					_oModel.setProperty("/Status/Percentages", null);
				},

				//Start
				at0: function (sMessage) {
					if (_at0) {
						_at0(sMessage);
					}
					_bRunning = true;
				},

				//End
				at100: function (sMessage) {
					if (_at100) {
						_at100(sMessage);
					}
					_bRunning = false;
					_oModel.setProperty("/Status/Percentages", null);
				}
			};
		}());
});