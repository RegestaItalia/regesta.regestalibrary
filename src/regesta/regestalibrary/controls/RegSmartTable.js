/*!
 * ${copyright}
 */
// Provides control regesta.regestalibrary.RegInput.
sap.ui.define(["jquery.sap.global", "./../library", "sap/ui/comp/smarttable/SmartTable", "sap/m/MessageBox", "sap/m/SegmentedButton",
		"sap/m/SegmentedButtonItem"
	],

	function (jQuery, library, SmartTable, MessageBox, SegmentedButton, SegmentedButtonItem) {
		"use strict";

		var RegSmartTable = SmartTable.extend("regesta.regestalibrary.controls.RegSmartTable", {

			_variantAnnotationRegex: /com\.sap\.vocabularies\.UI\.v1\.SelectionPresentationVariant#./,
			_variantSegmentedButton: null,

			metadata: {
				library: "regesta.regestalibrary",
				properties: {
					"enableQuickVariants": {
						type: "string",
						defaultValue: false
					}
				},
				aggregations: {
					quickVariants: {
						type: "regesta.regestalibrary.controls.RegQuickVariant",
						multiple: true,
						visibility: "public"
					}
				}
			},

			renderer: {},

			// overrides
			_createToolbarContent: function () {
				if (!this._oToolbar) {
					this._createToolbar();
				}
				this._addVariantManagementToToolbar();
				this._addQuickVariantButtonToToolbar();
				this._addSeparatorToToolbar();
				this._addHeaderToToolbar();
				this._addSpacerToToolbar();
				this._addEditTogglableToToolbar();
				this._addTablePersonalisationToToolbar();
				this._addExportToExcelToToolbar();
				this._addFullScreenButton();
				this._bToolbarInsertedIntoItems = true;
				this._placeToolbar();
			},

			// quickvariant management
			_addQuickVariantButtonToToolbar: function () {
				if (this._variantSegmentedButton) {
					return;
				}

				let quickVariantItems = this._loadQuickVariants();

				if (quickVariantItems && quickVariantItems.length > 0) {
					this._variantSegmentedButton = new SegmentedButton({
						items: quickVariantItems,
						selectedButton: "none",
						selectionChange: oEvent => {
							this._onQuickVariantSelected(oEvent)
						}
					});

					this._oToolbar.addContent(this._variantSegmentedButton);
				}
			},

			_loadQuickVariants: function () {
				let quickVariants = this.getQuickVariants();
				if (!quickVariants || quickVariants.length == 0) {
					quickVariants = this._readVariantsFromAnnotation();
				}

				if (quickVariants.length == 0) {
					return;
				}

				return quickVariants.map(item => {
					return new SegmentedButtonItem({
						key: item.annotationPath,
						icon: item.icon,
						text: item.text
					});
				});
			},

			_readVariantsFromAnnotation: function () {
				let variants = [];
				let entityTypeData = this._getEntityMetamodel();

				for (let key in entityTypeData) {
					if (key.match(this._variantAnnotationRegex)) {
						let text = entityTypeData[key].Text;
						variants.push({
							text: text ? text.String : "",
							annotationPath: key
						});
					}
				}

				return variants;
			},

			_onQuickVariantSelected: function (oEvent) {
				let annotationKey = oEvent.getParameter("item").getKey();
				let [selectionVariant, presentationVariant] = this._parseVariantAnnotation(annotationKey);

				this._applyQuickVariant(selectionVariant, presentationVariant);
				this._reBindTable();
			},

			_applyQuickVariant: function (oSelectionVariant, oPresentationVariant) {
				var variant = {};

				if (oSelectionVariant) {
					this._updateFilter(variant, oSelectionVariant);
				}

				if (oPresentationVariant) {
					this._updateColumns(variant, oPresentationVariant);
					this._updateSorting(variant, oPresentationVariant);
				}

				this.applyVariant(variant);
			},

			_getEntityMetamodel: function () {
				let metamodel = this.getModel().getMetaModel();
				let entitySet = this.getEntitySet();

				let entitySetData = metamodel.getODataEntitySet(entitySet);
				return metamodel.getODataEntityType(entitySetData.entityType);
			},

			_parseVariantAnnotation: function (sAnnotationKey) {
				let entityTypeData = this._getEntityMetamodel();
				let variantAnnotation = entityTypeData[sAnnotationKey];

				let [annotationType] = sAnnotationKey.split("#");
				switch (annotationType) {
				case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
					return [
						this._readVariantComponent(variantAnnotation, "SelectionVariant"),
						this._readVariantComponent(variantAnnotation, "PresentationVariant")
					];
				case "com.sap.vocabularies.UI.v1.PresentationVariant":
					return [null, variantAnnotation];
				case "com.sap.vocabularies.UI.v1.SelectionVariant":
					return [variantAnnotation, null];
				}
			},

			_readVariantComponent: function (oAnnotation, sComponentName) {
				let entityTypeData = this._getEntityMetamodel();
				let component = oAnnotation[sComponentName];

				if (!component.Path) {
					return component;
				}

				let path = component.Path.startsWith("@") ? component.Path.slice(1) : component.Path;
				return entityTypeData[path];
			},

			_updateFilter: function (oVariant, oSelectionVariant) {
				var items = [];

				if (!oSelectionVariant.SelectOptions || oSelectionVariant.SelectOptions.length == 0) {
					return;
				}

				for (let selectOption of oSelectionVariant.SelectOptions) {
					if (selectOption.PropertyName) {
						var path = selectOption.PropertyName.PropertyPath;

						if (!selectOption.Ranges || selectOption.Ranges.length == 0) {
							continue;
						}

						for (let range of selectOption.Ranges) {
							let option = range.Option;
							option.EnumMember = option.EnumMember.replace("com.sap.vocabularies.UI.v1.SelectionRangeOptionType/", "");

							let low = range.Low;
							let high = range.High;
							let lowValueKey = low ? Object.keys(low)[0] : null;
							let highValueKey = high ? Object.keys(high)[0] : null;

							items.push({
								columnKey: path,
								exclude: false,
								operation: option.EnumMember,
								value1: low ? low[lowValueKey] : undefined,
								value2: high ? high[highValueKey] : undefined
							});
						}
					}
				}

				oVariant.filter = {
					filterItems: items
				};
			},

			_updateColumns: function (oVariant, oPresentationVariant) {

				if (!oPresentationVariant.Visualizations || oPresentationVariant.Visualizations.length == 0) {
					return;
				}

				let visualization = oPresentationVariant.Visualizations[0];
				if (visualization.AnnotationPath) {
					let columns = [];
					let entityTypeData = this._getEntityMetamodel();
					let lineitemPath = visualization.AnnotationPath.startsWith("@") ? visualization.AnnotationPath.slice(1) : visualization.AnnotationPath;

					let lineItems = entityTypeData[lineitemPath];
					let index = 0;

					if (lineItems && lineItems.length > 0) {

						for (let item of lineItems) {
							if (item.Value && item.Value.Path) {
								columns.push({
									columnKey: item.Value.Path,
									index: ++index,
									visible: true
								});
							}
						}

						oVariant.columns = {
							columnsItems: columns
						};
					}
				}
			},

			_updateSorting: function (oVariant, oPresentationVariant) {
				if (!oPresentationVariant.SortOrder || oPresentationVariant.SortOrder.length == 0) {
					return;
				}

				let sortItems = [];
				for (var item of oPresentationVariant.SortOrder) {
					sortItems.push({
						columnKey: item.Property.PropertyPath,
						operation: (item.Descending && item.Descending.Bool == true) ? "Descending" : "Ascending"
					});
				}

				oVariant.sort = {
					sortItems: sortItems
				};
			}
		});

		return RegSmartTable;
	},
	/* bExport= */
	true);