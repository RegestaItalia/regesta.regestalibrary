sap.ui.define([
		"sap/ui/core/XMLComposite",
		"sap/ui/model/resource/ResourceModel",
		"sap/base/Log"
	],
	function (XMLComposite, ResourceModel, Log) {
		"use strict";

		var customPopover = XMLComposite.extend("regesta.regestalibrary.control.inlineHelp.InlineHelpPopover", function InlineHelpPopover() {
			var _AnnotationField = "/##Org.OData.Core.V1.LongText/String";
			var _PopoverImage = "regesta/regestalibrary/image/RegestaLogo.jpg";
			var _ControlPropertyName = "";
			var _ControlEntityTypeName = "";
			var _ResourceBundle = null;
			var _ui5ControlModel = null;
			var _sSaveFunctionName = "";
			// var _oUser = null;

			var _checkIfStringIsEmpty = function (sString) {
				return sString ? sString : _ResourceBundle.getText("NoData");
			};

			var _getEntityType = function (oContext) {
				var sEntitySet = oContext.getPath().replace(/ *\([^)]*\)|[/]*/g, "");
				var oMetaModel = _ui5ControlModel.getMetaModel();
				return new Promise(function (resolve, reject) {
					oMetaModel.loaded().then(function () {
						var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
						var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
						resolve({
							name: oEntityType.name,
							model: _ui5ControlModel
						});
					});
				});
			};
			var _checkForParts = function (oControl, keyProperty) {
				if (oControl.getBindingInfo(keyProperty) && oControl.getBindingInfo(keyProperty).parts && oControl.getBindingInfo(keyProperty).parts
					.length > 1) {
					return oControl.getBindingInfo(keyProperty).parts[0].path;
				}
				return null;
			};

			var _setPropertiesWithSpecificKeyProperty = function (oControl, keyProperty) {
				var oBindingContext = oControl.getBindingContext();
				var sControlPropertyName = oControl.getBinding(keyProperty).getPath();
				var sPopoverDescription = _checkIfStringIsEmpty("");
				if (!sControlPropertyName) {
					let sControlPropertyNameParts = _checkForParts(oControl, keyProperty);
					if (sControlPropertyNameParts) {
						sControlPropertyName = sControlPropertyNameParts;
						sPopoverDescription = _checkIfStringIsEmpty(oBindingContext.getProperty(sControlPropertyName + _AnnotationField));
					} else {
						sPopoverDescription = "Questo oggetto contiene parts";
					}
				} else {
					sPopoverDescription = _checkIfStringIsEmpty(oBindingContext.getProperty(sControlPropertyName + _AnnotationField));
				}

				_ControlPropertyName = sControlPropertyName; //per il salvataggio
				this.setProperty("_title", sControlPropertyName);
				this.setProperty("_popoverDescription", sPopoverDescription);
			};

			var _setPropertiesWithInputBase = function (oControl) {
				var sProperty = "";
				if (oControl instanceof sap.m.ComboBox) {
					sProperty = "selectedKey";
				} else {
					sProperty = "value";
				}
				_setPropertiesWithSpecificKeyProperty(oControl, sProperty);
			};

			var _setPropertiesWithCheckBox = function (oControl) {
				_setPropertiesWithSpecificKeyProperty(oControl, "selected");
			};

			var _setPropertiesWithText = function (oControl) {
				_setPropertiesWithSpecificKeyProperty(oControl, "text");
			};

			var _setProperties = function (oControl) {
				_getEntityType(oControl.getBindingContext()).then(function (name, model) {
					_ControlEntityTypeName = name;
					_ui5ControlModel.callFunction(_sSaveFunctionName, {
						method: "POST",
						urlParameters: {
							Contesto: _ControlEntityTypeName,
							Proprieta: _ControlPropertyName,
							Longtext: "Read"
						},
						success: function (data) {
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							throw new Error(JSON.stringify(error));
						}
					});
				});
				this.setIsUpToDate(true);
				if (oControl instanceof sap.m.InputBase) {
					_setPropertiesWithInputBase(oControl);
				} else if (oControl instanceof sap.m.CheckBox) {
					_setPropertiesWithCheckBox(oControl);
				} else if (oControl instanceof sap.m.Text) {
					_setPropertiesWithText(oControl);
				} else {
					this.setIsUpToDate(false); //Info are not updated, Popup is useless
				}
			};

			var _onUserCheck = function (oUser) {
				var bAauthorizedUser = true;
				//TODO: implement user checks
				//bAauthorizedUser = logical expression;
				this.setProperty("_authorizedUser", bAauthorizedUser);
			};

			return {
				metadata: {
					properties: {
						_title: {
							type: "string",
							group: "PopoverText"
						},
						_popoverDescription: {
							type: "string",
							group: "PopoverText"
						},
						_popoverImage: {
							type: "string",
							group: "PopoverText"
						},
						_authorizedUser: {
							type: "boolean"
						},
						isUpToDate: {
							type: "boolean",
							defaultValue: true
						},
						ui5Control: {
							type: "object"
						},
						sSaveFunctionName: {
							type: "string"
						}
					}
				},

				constructor: function (oParameters) {
					if (!_ui5ControlModel && oParameters.ui5Control && oParameters.ui5Control.getBindingContext && oParameters.ui5Control.getBindingContext() &&
						oParameters.ui5Control.getBindingContext().getModel) {
						_ui5ControlModel = oParameters.ui5Control.getBindingContext().getModel();
					}
					// _oUser = oParameters.oUser;
					_sSaveFunctionName = oParameters.sSaveFunctionName;
					XMLComposite.prototype.constructor.apply(this, arguments);
					// _onUserCheck(_oUser);

				},

				init: function () {
					XMLComposite.prototype.init.apply(this, arguments);
					_checkIfStringIsEmpty = _checkIfStringIsEmpty.bind(this);
					_getEntityType = _getEntityType.bind(this);
					_setPropertiesWithInputBase = _setPropertiesWithInputBase.bind(this);
					_setPropertiesWithCheckBox = _setPropertiesWithCheckBox.bind(this);
					_setPropertiesWithText = _setPropertiesWithText.bind(this);
					_setPropertiesWithSpecificKeyProperty = _setPropertiesWithSpecificKeyProperty.bind(this);
					_setProperties = _setProperties.bind(this);
					// _onUserCheck = _onUserCheck.bind(this);

					var sPopoverImage = sap.ui.require.toUrl(_PopoverImage);
					this.setProperty("_popoverImage", sPopoverImage);
					var oI18nModel = new ResourceModel({
						bundleName: "regesta.regestalibrary.i18n.i18n"
					});
					this.setModel(oI18nModel, "i18n");
					_ResourceBundle = oI18nModel.getResourceBundle();
				},

				setUi5Control: function (oValue) {
					this.setProperty("ui5Control", oValue);
					_setProperties(oValue);
				},

				openHelp: function (bSkipInstanceManager) {
					this.getAggregation(this.getMetadata().getCompositeAggregationName()).openBy(this.getUi5Control(), bSkipInstanceManager);
				},

				closeHelp: function (bSkipInstanceManager) {
					this.getAggregation(this.getMetadata().getCompositeAggregationName()).close();
				},

				isHelpOpen: function () {
					var internalPopup = this.getInternalPopup();
					return internalPopup.isOpen();
				},

				getInternalPopup: function () {
					return this.getAggregation(this.getMetadata().getCompositeAggregationName());
				},

				onSave: function (oEvent) {
					var oText = this.getRichTextEditorValue();
					_ui5ControlModel.callFunction(_sSaveFunctionName, {
						method: "POST",
						urlParameters: {
							Contesto: _ControlEntityTypeName,
							Proprieta: _ControlPropertyName,
							Longtext: oText.getValue()
						},
						success: function (data) {
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							throw new Error(JSON.stringify(error));
						}
					});
				},

				getRichTextEditorValue: function () {
					var oRichTextEditor = null;
					var oFragment = this.getAggregation(this.getMetadata().getCompositeAggregationName());
					if (oFragment && oFragment.getContent) {
						oRichTextEditor = oFragment.getContent().find(function (oControl) {
							return oControl instanceof sap.ui.richtexteditor.RichTextEditor;
						});
					}
					return oRichTextEditor;
				},
				handleRegAms: function () {
					Log.info("To be implemented");
				}
			};
		}());
		return customPopover;
	},
	/* bExport= */
	true);