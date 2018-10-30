sap.ui.define([], function () {
	"use strict";
	var DialogUtils = {};
	var _dialogs = [];

	var _resourceBundle = new sap.ui.model.resource.ResourceModel({
		bundleName: "regesta.regestalibrary.i18n.i18n"
	}).getResourceBundle();

	DialogUtils.showMessageBox = function (message, type, details) {
		var msgBox = sap.ca.ui.message.showMessageBox({
			type: type ? type : sap.ca.ui.message.Type.ERROR,
			message: message,
			details: details
		});
		if (!sap.ui.Device.support.touch) {
			msgBox.addStyleClass("sapUiSizeCompact");
		}
	};
	
	DialogUtils.getText = function(textName){
		return _resourceBundle.getText(textName);
	};
	
	DialogUtils.createDialog = function (content, options) {
		// TODO: fix outerclick of multiple stacked dialogs (second one steal listener from first one)
		if (!content) {
			throw ("Missing parameter for DialogUtils.createDialog");
		}

		var typeDefaults = {
			generic: {
				title: null,
				icon: null,
				state: sap.ui.core.ValueState.None,
				actions: ["close"]
			},
			message: {
				title: _resourceBundle.getText("DIALOG_MESSAGE"),
				icon: "sap-icon://message-information",
				state: sap.ui.core.ValueState.None,
				actions: ["close"]
			},
			question: {
				title: _resourceBundle.getText("DIALOG_QUESTION"),
				icon: "sap-icon://question-mark",
				state: sap.ui.core.ValueState.None,
				actions: ["accept", "reject"]
			},
			success: {
				title: _resourceBundle.getText("DIALOG_SUCCESS"),
				icon: "sap-icon://message-success",
				state: sap.ui.core.ValueState.Success,
				actions: ["close"]
			},
			warning: {
				title: _resourceBundle.getText("DIALOG_WARNING"),
				icon: "sap-icon://message-warning",
				state: sap.ui.core.ValueState.Warning,
				actions: ["close"]
			},
			error: {
				title: _resourceBundle.getText("DIALOG_ERROR"),
				icon: "sap-icon://message-error",
				state: sap.ui.core.ValueState.Error,
				actions: ["close"]
			}
		};
		
		var buttonDefaults = {
			accept: {
				text: _resourceBundle.getText("DIALOG_ACCEPT"),
				icon: "sap-icon://accept",
				type: sap.m.ButtonType.Accept
			},
			reject: {
				text: _resourceBundle.getText("DIALOG_REJECT"),
				icon: "sap-icon://decline",
				type: sap.m.ButtonType.Reject
			},
			confirm: {
				text: _resourceBundle.getText("DIALOG_CONFIRM"),
				icon: "sap-icon://accept",
				type: sap.m.ButtonType.Emphasized
			},
			abort: {
				text: _resourceBundle.getText("DIALOG_ABORT"),
				icon: "sap-icon://decline",
				type: sap.m.ButtonType.Default
			},
			close: {
				text: _resourceBundle.getText("DIALOG_CLOSE"),
				icon: "sap-icon://inspect-down",
				type: sap.m.ButtonType.Default
			}
		};

		options = options || {};
		options.type = options.type || "generic";
		options.icon = options.icon || typeDefaults[options.type].icon;
		options.title = options.title || typeDefaults[options.type].title;
		options.state = options.state || typeDefaults[options.type].state;
		options.size = options.size || "auto";
		options.stretch = options.stretch || options.stretch === true;
		options.preventDuplicate = options.preventDuplicate || options.preventDuplicate !== false;
		options.autoOpen = options.autoOpen || options.autoOpen !== false;
		options.closeOnOuterTap = options.closeOnOuterTap || options.closeOnOuterTap !== false;
		options.closeOnEscape = options.closeOnEscape || options.closeOnEscape !== false;
		options.draggable = options.draggable || options.draggable !== false;
		options.resizable = options.resizable || options.resizable === true;
		options.showButtonIcons = options.showButtonIcons || options.showButtonIcons === true;
		options.padding = options.padding || options.padding !== false;
		options.compact = options.compact || options.compact !== false;
		options.fragment = options.fragment || options.fragment === true;

		var dialog = _dialogs[content];

		if (!(options.preventDuplicate && dialog && dialog.isOpen())) {
			dialog = new sap.m.Dialog();
			if (this.getView) {
				this.getView().addDependent(dialog);
			}

			// content
			if (options.fragment) {
				dialog.addContent(sap.ui.xmlfragment(content, this));
			} else {
				dialog.addContent(new sap.m.Text({
					width: "100%",
					text: content,
					textAlign: "Center"
				}));
			}

			if (options.customHeader) {
				dialog.setCustomHeader(options.customHeader);
			}
			if (options.subHeader) {
				dialog.setSubHeader(options.subHeader);
			}

			// options
			dialog.setTitle(options.title);
			dialog.setIcon(options.icon);
			dialog.setState(options.state);
			dialog.setShowHeader(!(!options.title && !options.icon));
			if (dialog.setDraggable) {
				dialog.setDraggable(options.draggable);
			}
			if (dialog.setResizable) {
				dialog.setResizable(options.resizable);
			}
			if (options.padding) {
				dialog.addStyleClass("sapUiContentPadding");
			}
			if (options.compact) {
				dialog.addStyleClass("sapUiSizeCompact");
			}
			if (options.stretch) {
				dialog.setContentWidth("auto");
				dialog.setContentHeight("auto");
				dialog.setStretch(true);
			} else {
				dialog.setContentWidth(options.size.split(",")[0]);
				dialog.setContentHeight(options.size.split(",")[1] || "auto");
				dialog.setStretch(false);
			}

			// actions
			(options.actions || typeDefaults[options.type].actions).forEach(function (x) {
				dialog.addButton(new sap.m.Button({
					icon: options.showButtonIcons ? options[x + "Icon"] || buttonDefaults[x].icon : null,
					text: options.showButtonIcons ? null : options[x + "Text"] || buttonDefaults[x].text,
					type: options[x + "Type"] || buttonDefaults[x].type,
					press: function () {
						new Promise(function (resolve) {
							if (options[x + "Callback"]) {
								options[x + "Callback"].call(this, resolve, dialog);
							} else {
								resolve();
							}
						}).then(function () {
							dialog.close();
						});
					}
				}));
			});

			// additional handlers
			dialog.attachAfterOpen(function () {
				if (options.closeOnOuterTap) {
					document.getElementById(dialog.getId()).parentElement.parentElement.onclick = function (e) {
						if (e.target.className.indexOf("sapMDialogBlockLayerInit") > -1) {
							new Promise(function (resolve) {
								if (options.outerTapCallback) {
									options.outerTapCallback.call(this, resolve, dialog);
								} else {
									resolve();
								}
							}).then(function () {
								dialog.close();
							});
						}
					};
				}
			}.bind(this, dialog));
			if (dialog.setEscapeHandler) {
				dialog.setEscapeHandler(function () {
					if (options.closeOnEscape) {
						new Promise(function (resolve) {
							if (options.escapeCallback) {
								options.escapeCallback.call(this, resolve, dialog);
							} else {
								resolve();
							}
						}).then(function () {
							dialog.close();
						});
					}
				}.bind(this, dialog));
			}

			_dialogs[content] = dialog;
		}

		if (options.autoOpen) {
			dialog.open();
		}

		return dialog;
	};

	return DialogUtils;
});