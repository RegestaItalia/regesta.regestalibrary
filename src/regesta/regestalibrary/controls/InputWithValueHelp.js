sap.ui.define([
		'sap/ui/core/XMLComposite'
	],
	function (XMLComposite) {
		"use strict";
		var inputWithValueHelp = XMLComposite.extend("regesta.regestalibrary.controls.InputWithValueHelp", {
			metadata: {
				properties: {
					title: "string",

				},
				aggregations: {
					dialogItems: {
						type: "sap.m.ListItemBase",
						multiple: true,
						forwarding: {
							idSuffix: "--dialog",
							aggregation: "items"
						}
					}
				},
				events: {
					dialogLiveChange: {
						value: "string",
						itemsBinding: "any"
					},
					inputChange: {
						value: "string"
					}
				}
			},
			init: function () {},
			setValue: function (value) {
				this.byId("input").setValue(value);
			},
			getValue: function () {
				return this.byId("input").getValue();
			},
			_showValueHelp: function () {
				var dialog = this.byId("dialog");
				dialog.open();
				//pulisce filtri
				dialog.fireLiveChange({
					value: ""
				});
			},
			_liveChange: function (oEvent) {
				const params = oEvent.getParameters();
				params.itemsBinding = this.getBinding("dialogItems");
				this.fireEvent("dialogLiveChange", params);
			},
			_inputChange: function (oEvent) {
				const params = oEvent.getParameters();
				this.fireEvent("inputChange", params);
			},
			_confirm: function (oEvent) {
				//TODO dare la possibiltà di definire delle chiavi custom invece di prendere il titolo dell'oggetto 
				this.setValue(oEvent.getParameter("selectedItem").getTitle());
			},

		});

		return inputWithValueHelp;
	},
	/* bExport= */
	true);