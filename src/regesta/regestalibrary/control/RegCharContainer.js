/** 
 * Provides control regesta.regestalibrary.RegCharContainer.
 * 
 * @member RegCharContainer
 * @memberof regesta.regestalibrary.control
 */
sap.ui.define(["jquery.sap.global",
		"./../library",
		"sap/ui/core/Control",
		"sap/ui/table/Table",
		"sap/ui/table/Column",
		"regesta/regestalibrary/utilities/BindingUtils"
	],

	function (jQuery, library, Control, Table, Column, BindingUtils) {
		"use strict";

		var RegCharContainer = Control.extend("regesta.regestalibrary.control.RegCharContainer", {
			metadata: {
				library: "regesta.regestalibrary",

				properties: {
					"editable": {
						type: "boolean",
						defaultValue: false
					}
				},

				aggregations: {
					items: {
						type: "regesta.regestalibrary.controls.RegCharItem",
						multiple: true,
						visibility: "public"
					},
					iconTabBar: {
						type: "sap.m.IconTabBar",
						multiple: false,
						visibility: "public"
					}
				},
				
				defaultAggregation: "items"
			},

			init: function () {
				if (!this.getIconTabBar()) {
					var oIconTabBar = new sap.m.IconTabBar();
					this.setIconTabBar(oIconTabBar);
				}
			},

			renderer: {
				render: function (oRm, oControl) {
					// control header data
					oRm.write("<div");
					oRm.writeControlData(oControl);
					oRm.write(">");

					// render content
					var createContent = oControl._createContent.bind(oControl);
					createContent();

					var oIconTabBar = oControl.getIconTabBar();
					oRm.renderControl(oIconTabBar);

					// close control div
					oRm.write("</div>");
				}
			},

			// private functions
			_createContent: function () {
				var groups = this._getGroups();

				if (groups.length > 0) {
					this._createItems(groups);
				}
			},

			_getGroups: function () {
				var groups = [];
				var key;

				var items = this.getItems();

				$.each(items, function (index, item) {
					key = item.getGroup();

					var groupsForKey = $.grep(groups, function (group) {
						return group.key === key;
					});

					if (groupsForKey.length === 0) {
						groups.push({
							key: key,
							items: [{
								name: item.getName(),
								value: item.getValue(),
								description: item.getDescription()
							}]
						});
					} else {
						groupsForKey[0].items.push({
							name: item.getName(),
							value: item.getValue(),
							description: item.getDescription()
						});
					}
				});

				return groups;
			},

			_createItems: function (aGroups) {
				var oIconTabBar = this.getIconTabBar();
				oIconTabBar.removeAllItems();

				for (var i = 0; i < aGroups.length; i++) {
					var group = aGroups[i];
					oIconTabBar.addItem(this._createTabItem(group));
				}
			},

			_createTabItem: function (oGroupItem) {
				return new sap.m.IconTabFilter({
					key: oGroupItem.key,
					text: oGroupItem.key,
					content: this._createCharsTable(oGroupItem.key)
				});
			},

			_createCharsTable: function (sKey) {
				var bindingInfo = this.getBindingInfo("items");

				var oTable = new Table({
					selectionMode: "None",
					columns: this._createColumns()
				});

				oTable.bindRows({
					path: bindingInfo.path,
					model: bindingInfo.model,
					template: bindingInfo.template,
					filters: [new sap.ui.model.Filter(bindingInfo.template.getBindingPath("group"), sap.ui.model.FilterOperator.EQ, sKey)]
				});

				return oTable;
			},

			_createColumns: function () {
				var editable = this.getEditable() === true;

				return [
					this._createColumn("i18n>CHAR_COLUMN_NAME", "name", false),
					this._createColumn("i18n>CHAR_COLUMN_VALUE", "value", editable),
					this._createColumn("i18n>CHAR_COLUMN_DESCRIPTION", "description", false)
				];
			},

			_createColumn: function (labelBinding, bindingName, bEditable) {
				var itemTemplate = this.getBindingInfo("items").template;
				var binding = itemTemplate.getBindingInfo(bindingName);

				return new Column({
					label: new sap.m.Label({
						text: {
							path: labelBinding
						}
					}),
					template: this._createInnerControl(binding, bEditable)
				});
			},

			_createInnerControl: function (oBinding, bEditable) {
				if (!oBinding) {
					return null;
				}

				return bEditable === true ? new sap.m.Input().bindValue(oBinding) : new sap.m.Text().bindText(oBinding);
			}
		});

		return RegCharContainer;
	},
	/* bExport= */
	true);