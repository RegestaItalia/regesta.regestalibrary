sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/ws/SapPcpWebSocket"
], function (UI5Object, MessageToast, MessageBox, SapPcpWebSocket) {
	"use strict";
	return UI5Object.extend("regesta.regestalibrary.controller.WebSocketSapMessage", function WebSocketSapMessage() {
		var _SapPcpWebSocket = null;
		var _OwnerComponent = null;

		var _onAttachMessage = function (oEvent) {
			try {
				if (oEvent.getParameter("pcpFields")) {
					switch (oEvent.getParameter("pcpFields").msgty) {
					case 'E':
					case 'A':
						sap.m.MessageBox.show(oEvent.getParameter("data"), {
							icon: MessageBox.Icon.ERROR,
							title: "SAP messages",
							actions: MessageBox.Action.OK
						});
					case 'I':
					case 'S':
					case 'W':
						MessageToast.show(oEvent.getParameter("data"));
						break;
					default:
						MessageToast.show(oEvent.getParameter("data"));
						break;
					}
				}
			} catch (err) {
				throw "Errore in gestione push message";
			}
		};
		
		var _onAttachOpen = function (oEvent) {
			MessageToast.show('Websocket connection opened');
		};


		return {
			constructor: function (oParents) {
				if (!sap.ui.Device.support.websocket) {
					MessageBox.show("Your SAPUI5 Version does not support WebSockets", {
						icon: MessageBox.Icon.INFORMATION,
						title: "WebSockets not supported",
						actions: MessageBox.Action.OK
					});
				}
				_SapPcpWebSocket = new SapPcpWebSocket(oParents.SapWSEndPoint, SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10);
				_OwnerComponent = oParents.OwnerComponent;
			},
			start: function () {
				_SapPcpWebSocket.attachOpen( _onAttachOpen );
				_SapPcpWebSocket.attachMessage( _onAttachMessage );
			},

			stop: function () {}
		};
	}());
});