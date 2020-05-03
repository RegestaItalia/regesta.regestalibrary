sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/ws/SapPcpWebSocket",
	"sap/ui/model/resource/ResourceModel",
	"regesta/regestalibrary/control/WebSocketMessage/ProgressWithMessages/ProgressWithMessages"
], function (UI5Object, MessageToast, MessageBox, SapPcpWebSocket, ResourceModel, ProgressWithMessages) {
	"use strict";
	return UI5Object.extend("regesta.regestalibrary.controller.WebSocketSapMessage", function WebSocketSapMessage() {
		var _SapPcpWebSocket = null;
		//var _OwnerComponent = null;
		var _i18nModel = null;
		var _ProgressWithMessages = null;
		var _actStep = null;
		var _maxStep = null;

		var _getText = function (sText) {
			return _i18nModel.getResourceBundle().getText(sText);
		};

		var _getPercentage = function () {
			if (_maxStep ) {
				return Math.round(_actStep * (100 / _maxStep));
			} else
				return 0;
		};

		var _onAttachMessage = function (oEvent) {
			try {
				var oStatus = {};
				if (oEvent.getParameter("pcpFields")) {
					var oPcp = oEvent.getParameter("pcpFields");
					if (oPcp.NumeroStep) {
						_actStep = 0;
						_maxStep = Number(oPcp.NumeroStep);
					}
				}
				oStatus.Percentages = _getPercentage();
				if (oEvent.getParameter("data")) {
				//	oStatus.Message = oEvent.getParameter("data");
					if (_maxStep ) {
						++_actStep;
					}
				}
				_ProgressWithMessages.onStatusValuesChange(oStatus);
				MessageToast.show(oEvent.getParameter("data"));
			} catch (err) {
				_ProgressWithMessages.onError();
				throw "Errore in gestione push message";
			}
		};

		var _onAttachOpen = function (oEvent) {
			MessageToast.show('Websocket connection opened');
		};

		return {
			constructor: function (oParams) {
				if (this.checkVersion()) {
					_getText = _getText.bind(this);
					_i18nModel = new ResourceModel({
						bundleName: "regesta.regestalibrary.i18n.i18n"
					});
					_SapPcpWebSocket = new SapPcpWebSocket(oParams.SapWSEndPoint, SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10);
					_ProgressWithMessages = new ProgressWithMessages(oParams.ProgrssWithMessages);
				}
			},

			checkVersion: function () {
				var bCheck = true;
				if (!sap.ui.Device.support.websocket) {
					MessageBox.show(_getText("webSocketsNotSupportedText"), {
						icon: MessageBox.Icon.INFORMATION,
						title: _getText("webSocketsNotSupportedTitle"),
						actions: MessageBox.Action.OK
					});
					bCheck = false;
				}
				return bCheck;
			},

			start: function () {
				_SapPcpWebSocket.attachOpen(_onAttachOpen);
				_SapPcpWebSocket.attachMessage(_onAttachMessage);
			},

			stop: function () {
				//TODO: to implement
			},

			getProgessStatusWithMessages: function () {
				return _ProgressWithMessages;
			},

			//NOTE: TEST METHOD
			statusIndicatorDemo: function () {
				var index = 0;
				var to100 = function () {
					setTimeout(function () {
						_ProgressWithMessages.onStatusValuesChange({
							Percentages: index,
							Message: Math.random().toString(36).substring(7)
						});
						index++;
						if (index <= 100) {
							to100();
						}
					}.bind(this), 2000);
				};
				to100();
			}
		};
	}());
});