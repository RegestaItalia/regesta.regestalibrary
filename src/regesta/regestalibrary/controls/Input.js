sap.ui.define([
	"regesta/regestalibrary/js/MessageHelper",
	"regesta/regestalibrary/js/ModelHelper",
	"regesta/regestalibrary/js/UiHelper",
	"sap/m/Input",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/model/Filter"
], function (MessageHelper, ModelHelper, UiHelper, Input, SmartFilterBar, SmartTable, Filter) {
	"use strict";

	return Input.extend("regesta.regestalibrary.controls.Input", {
		metadata: {
			properties: {
				entitySet: {
					type: "string"
				},
				localModel: {
					type: "string",
					defaultValue: "local"
				},
				suggestionEntitySet: {
					type: "string"
						/*default: _keyProperty + "Set"*/
				},
				suggestionProperties: {
					type: "string",
					defaultValue: "Code,Description"
				},
				valueHelpEntitySet: {
					type: "string"
						/*default: _keyProperty + "Set"*/
				}
			},
			aggregations: {
				valueHelpDialog: {
					type: "sap.m.Dialog",
					multiple: false
				}
			},
			events: {
				valueHelpItemSelected: {},
				beforeRebindValueHelpTable: {}
			}
		},
		renderer: {},

		init: function () {
			Input.prototype.init.apply(this, arguments);

			this.setBusyIndicatorDelay(0);
			this.setFilterSuggests(false);

			this.attachValueHelpRequest(this.onValueHelpRequest);
			this.attachValueHelpItemSelected(this.onValueHelpItemSelected);
			this.attachSuggest(this.onSuggest);
			this.attachSuggestionItemSelected(this.onSuggestionItemSelected);
			this.attachLiveChange(this.onLiveChange);
			this.attachParseError(this.onParseError);
		},
		onBeforeRendering: function () {
			Input.prototype.onBeforeRendering.apply(this, arguments);

			if (!this._customInitialized) {
				this._customInit();
			}
		},
		onLiveChange: function (e) {
			var binding = this.getBindingInfo("value").binding;
			var bindingPath = binding.getPath();
			var bindingContext = binding.getContext();

			MessageHelper.removeErrorMessages({
				targets: bindingContext ? bindingContext + "/" + bindingPath : bindingPath
			});
		},
		onParseError: function () {
			var view = UiHelper.getParentOfType(this, "sap.ui.core.mvc.XMLView");
			var controller = view.getController();
			var i18n = ModelHelper.getModel(controller, "i18n");
			var i18nBundle = i18n.getResourceBundle();
			var binding = this.getBinding("value");
			var bindingModel = binding.getModel();
			var bindingPath = binding.getPath();
			var bindingContext = binding.getContext();

			MessageHelper.addErrorMessages({
				target: bindingContext ? bindingContext + "/" + bindingPath : bindingPath,
				processor: bindingModel,
				message: i18nBundle.getText("errInvalidInput")
			});

			setTimeout(function () {
				MessageHelper.removeErrorMessages({
					targets: this.getId() + "/value"
				});
			}.bind(this), 0);
		},
		onSuggest: function (e) {
			var source = e.getSource();
			var suggestionBinding = source.getBinding("suggestionItems") || source.getBinding("suggestionRows");
			var term = e.getParameter("suggestValue");
			var filters = [];

			if (term) {
				filters.push(new Filter("Code", sap.ui.model.FilterOperator.Contains, term));
				filters.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, term));
			}

			if (this.mEventRegistry.suggest.length === 1) { // eslint-disable-line sap-no-ui5base-prop
				suggestionBinding.filter(filters);
			}
		},
		onSuggestionItemSelected: function (e) {
			var selectedItem = e.getParameter("selectedItem") || e.getParameter("selectedRow");
			var selectedItemData = selectedItem.getBindingContext().getObject();
			var suggestionProperties = this.getSuggestionProperties().split(",");

			this.setProperty("value", selectedItemData[suggestionProperties[0]]);
			this.setProperty("description", selectedItemData[suggestionProperties[1]]);
		},
		onValueHelpItemSelected: function (e) {
			var source = e.getSource();
			var selectedItem = e.getParameter("rowContext");
			var selectedItemData = selectedItem.getObject();
			var suggestionProperties = this.getSuggestionProperties().split(",");

			ModelHelper.setBindedProperty(source, "value", selectedItemData[suggestionProperties[0]]);
			ModelHelper.setBindedProperty(source, "description", selectedItemData[suggestionProperties[1]]);

			this.fireChange();
		},
		onValueHelpRequest: function () {
			var valueHelpDialog = this.getAggregation("valueHelpDialog");

			if (!valueHelpDialog) {
				this._createValueHelpDialog();

				valueHelpDialog = this.getAggregation("valueHelpDialog");
			}

			valueHelpDialog.open();
		},

		_bindSuggestionItems: function () {
			var suggestionEntitySet = this.getSuggestionEntitySet();
			var suggestionProperties = this.getSuggestionProperties().split(",");

			if (suggestionProperties.length > 2) {
				var template = new sap.m.ColumnListItem();

				this.destroySuggestionColumns();
				suggestionProperties.forEach(function (columnProperty) {
					this.addSuggestionColumn(new sap.m.Column({
						header: new sap.m.Label({
							text: {
								path: columnProperty,
								model: "i18n"
							}
						})
					}));

					template.addCell(new sap.m.Text({
						text: {
							path: columnProperty
						}
					}));
				}.bind(this));

				this.bindAggregation("suggestionRows", {
					path: "/" + suggestionEntitySet,
					template: template
				});
			} else if (suggestionProperties.length === 2) {
				this.bindAggregation("suggestionItems", {
					path: "/" + suggestionEntitySet,
					template: new sap.ui.core.ListItem({
						text: {
							path: suggestionProperties[0]
						},
						additionalText: {
							path: suggestionProperties[1]
						}
					})
				});
			} else if (suggestionProperties.length === 1) {
				this.bindAggregation("suggestionItems", {
					path: "/" + suggestionEntitySet,
					template: new sap.ui.core.ListItem({
						text: {
							path: suggestionProperties[0]
						}
					})
				});
			}
		},
		_bindProperties: function () {
			var entitySet = this.getEntitySet();
			var view = UiHelper.getParentOfType(this, "sap.ui.core.mvc.XMLView");
			var oDataModel = ModelHelper.getDefaultModel(view.getController());
			var localModelName = this.getLocalModel();
			var entityMetadata = entitySet ? ModelHelper.getEntitySetEntityMetadata(oDataModel, entitySet) : {};
			var entity = entityMetadata.name;

			this.bindProperty("description", {
				path: "/" + this._keyProperty + "Description",
				model: localModelName
			});
			this.bindProperty("busy", {
				path: "/" + this._keyProperty + "Busy",
				model: localModelName
			});

			if (entity) {
				this.bindProperty("maxLength", {
					path: "/#" + entity + "/" + this._keyProperty + "/@maxLength",
					formatter: function (value) {
						return value * 1 || 0;
					}
				});
			} else {
				console.warn("input \"" + this.getId() + "\" without indication of entitySet"); // eslint-disable-line no-console
			}

			this.setName(this._keyProperty);
		},
		_checkCustomProperties: function () {
			var suggestionEntitySet = this.getSuggestionEntitySet();
			var suggestionProperties = this.getSuggestionProperties();
			var valueHelpEntitySet = this.getValueHelpEntitySet();
			var valueBindingInfo = this.getBindingInfo("value").parts[0];
			var bindingPath = valueBindingInfo.path;

			this._keyProperty = bindingPath.replace("/", "");

			if (suggestionProperties.split(",").length < 1) {
				throw new Error("Property \"suggestionProperties\" must have at least one entry");
			}
			if (!suggestionEntitySet) {
				this.setSuggestionEntitySet(this._keyProperty + "Set");
			}
			if (!valueHelpEntitySet) {
				this.setValueHelpEntitySet(this._keyProperty + "Set");
			}
		},
		_createValueHelpDialog: function () {
			var valueHelpDialog = this.getAggregation("valueHelpDialog");
			var valueHelpEntitySet = this.getValueHelpEntitySet();
			var suggestionProperties = this.getSuggestionProperties();

			var smartFilterBar = new SmartFilterBar({
				id: this.getId() + "_" + "ValueHelpFilterBar",
				entitySet: valueHelpEntitySet,
				persistencyKey: this._keyProperty + "ValueHelpFilterBar"
			});
			var smartTable = new SmartTable({
				smartFilterId: this.getId() + "_" + "ValueHelpFilterBar",
				entitySet: valueHelpEntitySet,
				useExportToExcel: false,
				persistencyKey: this._keyProperty + "ValueHelpTable",
				initiallyVisibleFields: suggestionProperties,
				beforeRebindTable: function (e) {
					this.fireEvent("beforeRebindValueHelpTable", e.getParameters());
				}.bind(this),
				layoutData: new sap.m.FlexItemData({
					growFactor: 1
				})
			});
			var table = smartTable.getTable();

			table.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
			table.setVisibleRowCount(10);
			table.setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
			table.setSelectionMode(sap.ui.table.SelectionMode.Single);
			table.attachRowSelectionChange(function (e) {
				this.fireEvent("valueHelpItemSelected", e.getParameters());

				this.getAggregation("valueHelpDialog").close();
			}.bind(this));
			smartFilterBar.search();

			valueHelpDialog = UiHelper.showDialog(this,
				new sap.m.VBox({
					items: [
						smartFilterBar,
						smartTable
					]
				}), {
					padding: false,
					autoOpen: false,
					title: {
						path: this._keyProperty + "Plural",
						model: "i18n"
					}
				});

			this.setAggregation("valueHelpDialog", valueHelpDialog, true);
		},
		_customInit: function () {
			var showSuggestionItems = this.getShowSuggestion();

			this._checkCustomProperties();

			this._bindProperties();

			if (showSuggestionItems) {
				this._bindSuggestionItems();
			}

			this._customInitialized = true;
		}
	});
});