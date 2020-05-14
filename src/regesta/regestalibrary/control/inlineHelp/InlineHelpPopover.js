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
						// return oEntityType.name;
						resolve(oEntityType.name);
					});
				});
			};

			var _setPropertiesWithInputBase = function (oControl) {
				var oBindingContext = oControl.getBindingContext();
				var sProperty = "";
				if (oControl instanceof sap.m.ComboBox) {
					sProperty = "selectedKey";
				} else {
					sProperty = "value";
				}
				var sControlPropertyName = oControl.getBinding(sProperty).getPath();

				var sPopoverDescription = _checkIfStringIsEmpty(oBindingContext.getProperty(sControlPropertyName + _AnnotationField));

				_ControlPropertyName = sControlPropertyName;
				// _ControlEntityTypeName = _getEntityType(oBindingContext);

				this.setProperty("_title", sControlPropertyName);
				this.setProperty("_popoverDescription", sPopoverDescription);
			};

			var _setPropertiesWithCheckBox = function (oControl) {
				var oBindingContext = oControl.getBindingContext();

				var sControlPropertyName = oControl.getBinding("selected").getPath();

				var sPopoverDescription = _checkIfStringIsEmpty(oBindingContext.getProperty(sControlPropertyName + _AnnotationField));

				_ControlPropertyName = sControlPropertyName;
				// _ControlEntityTypeName = _getEntityType(oBindingContext);

				this.setProperty("_title", sControlPropertyName);
				this.setProperty("_popoverDescription", sPopoverDescription);
			};

			//TODO: implement logic for other classes and subclasses
			var _setProperties = function (oControl) {
				_getEntityType(oControl.getBindingContext()).then(function (name) {
					_ControlEntityTypeName = name;
				});
				if (oControl instanceof sap.m.InputBase) {
					_setPropertiesWithInputBase(oControl);
				} else if (oControl instanceof sap.m.CheckBox) {
					_setPropertiesWithCheckBox(oControl);
				}
			};

			var _onUserCheck = function (oUser) {
				var bAauthorizedUser = true;
				//TODO: implement user checks
				//bAauthorizedUser = logical expression;
				this.setProperty("_authorizedUser", bAauthorizedUser);
			};
			
			//TODO: visibility: hidden è stata commentata per retrocompatibilità con la 1.60, si potrebbe metterla condizionata alla versione sapui5
			return {
				metadata: {
					properties: {
						_title: {
							type: "string",
							group: "PopoverText",
							// visibility: "hidden"
						},
						_popoverDescription: {
							type: "string",
							group: "PopoverText",
							// visibility: "hidden"
						},
						_popoverImage: {
							type: "string",
							group: "PopoverText",
							// visibility: "hidden"
						},
						_authorizedUser: {
							type: "boolean",
							// visibility: "hidden"
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
					if (!_ui5ControlModel && oParameters.ui5Control && oParameters.ui5Control.getBindingContext && oParameters.ui5Control.getBindingContext()
						.getModel) {
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