sap.ui.define([
	"regesta/regestalibrary/enums/DialogActions",
	"regesta/regestalibrary/enums/DialogTypes",
	"regesta/regestalibrary/utilities/BindingUtils"
], function (DialogActions, DialogTypes, BindingUtils) {
	"use strict";
	var DialogUtils = {};

	var _resourceBundle = new sap.ui.model.resource.ResourceModel({
		bundleName: "regesta.regestalibrary.i18n.i18n"
	}).getResourceBundle();

	var _dialogs = {};
	var _dialogsTypeDefaults = {
		Generic: {
			title: null,
			icon: null,
			state: sap.ui.core.ValueState.None,
			actions: ["Close"],
			type: "Standard",
			resizab  le: true
		},
		Message: {
			title: _resourceBundle.getText("dialogMessage"),
			icon: "sap-icon://message-information",
			state: sap.ui.core.ValueState.Information,
			actions: [],
			type: "Message",
			resizable: false
		},
		Question: {
			title: _resourceBundle.getText("dialogQuestion"),
			icon: "sap-icon://question-mark",
			state: sap.ui.core.ValueState.None,
			actions: ["Accept", "Reject"],
			type: "Message",
			resizable: false
		},
		Success: {
			title: _resourceBundle.getText("dialogSuccess"),
			icon: "sap-icon://message-success",
			state: sap.ui.core.ValueState.Success,
			actions: [],
			type: "Message",
			resizable: false
		},
		Warning: {
			title: _resourceBundle.getText("dialogWarning"),
			icon: "sap-icon://message-warning",
			state: sap.ui.core.ValueState.Warning,
			actions: [],
			type: "Message",
			resizable: false
		},
		Error: {
			title: _resourceBundle.getText("dialogError"),
			icon: "sap-icon://message-error",
			state: sap.ui.core.ValueState.Error,
			actions: [],
			type: "Message",
			resizable: false
		}
	};
	var _dialogsActionDefaults = {
		Accept: {
			text: _resourceBundle.getText("dialogAccept"),
			icon: "sap-icon://accept",
			type: sap.m.ButtonType.Emphasized
		},
		Reject: {
			text: _resourceBundle.getText("dialogReject"),
			icon: "sap-icon://decline",
			type: sap.m.ButtonType.Default
		},
		Confirm: {
			text: _resourceBundle.getText("dialogConfirm"),
			icon: "sap-icon://accept",
			type: sap.m.ButtonType.Emphasized
		},
		Abort: {
			text: _resourceBundle.getText("dialogAbort"),
			icon: "sap-icon://decline",
			type: sap.m.ButtonType.Default
		},
		Close: {
			text: _resourceBundle.getText("dialogClose"),
			icon: "sap-icon://inspect-down",
			type: sap.m.ButtonType.Default
		}
	};

	DialogUtils.dialog = function (context, content, options, name) { // eslint-disable-line complexity
		BindingUtils.checkParameters("dialog", [{
			name: "context",
			value: context
		}, {
			name: "content",
			value: content
		}]);

		options = options || {};
		options.rebuild = options.rebuild || options.rebuild === true;
		options.type = options.type || this.DialogTypes.Generic;
		options.icon = options.icon || _dialogsTypeDefaults[options.type].icon;
		options.title = options.title || _dialogsTypeDefaults[options.type].title;
		options.state = options.state || _dialogsTypeDefaults[options.type].state;
		options.draggable = options.draggable || options.draggable !== false;
		options.resizable = options.resizable || _dialogsTypeDefaults[options.type].resizable;
		options.stretch = options.stretch || options.stretch === true;
		options.contentWidth = options.stretch ? "auto" : options.contentWidth;
		options.contentHeight = options.stretch ? "auto" : options.contentHeight;
		options.fragment = options.fragment || options.fragment === true;
		options.textAlign = options.textAlign || "Center";
		options.actions = options.actions || _dialogsTypeDefaults[options.type].actions;
		options.buttonIcons = options.buttonIcons || options.buttonIcons === true;
		options.closeOnOuterTap = options.closeOnOuterTap || options.closeOnOuterTap !== false;
		options.autoOpen = options.autoOpen || options.autoOpen !== false;

		var dialogKey = name + content;
		var dialog = _dialogs[dialogKey];

		if (!dialog || options.rebuild) {
			dialog = new sap.m.Dialog({
				icon: options.icon,
				title: options.title,
				customHeader: options.customHeader,
				subHeader: options.subHeader,
				state: options.state,
				type: _dialogsTypeDefaults[options.type].type,
				showHeader: !(!options.title && !options.icon),
				draggable: options.draggable,
				resizable: options.resizable,
				contentWidth: options.contentWidth,
				contentHeight: options.contentHeight,
				stretch: options.stretch,
				content: options.fragment ? sap.ui.xmlfragment(content, context) : new sap.m.Text({
					width: "100%",
					text: content,
					textAlign: options.textAlign
				})
			});

			if (context.getView) {
				context.getView().addDependent(dialog);
			}

			dialog.addStyleClass(this.getContentDensity(context));

			// actions
			options.actions.forEach(function (action) {
				dialog.addButton(new sap.m.Button({
					icon: options.buttonIcons ? options[action + "Icon"] || _dialogsActionDefaults[action].icon : null,
					text: options.buttonIcons ? null : options[action + "Text"] || _dialogsActionDefaults[action].text,
					type: options[action + "Type"] || _dialogsActionDefaults[action].type,
					press: function (e) {
						var sourceDialog = this.parentOfType(e.getSource(), "sap.m.Dialog");

						new Promise(function (resolve) {
							if (options[action + "Callback"]) {
								options[action + "Callback"].call(this, resolve, sourceDialog);
							} else {
								resolve();
							}
						}).then(function () {
							sourceDialog.close();
						});
					}.bind(this)
				}));
			}.bind(this));

			// additional handlers
			dialog.attachAfterOpen(function (e) {
				dialog = e.getSource();
				var domDialog = dialog.getDomRef();

				if (dialog.getType() === "Message") {
					setTimeout(function () { // eslint-disable-line sap-timeout-usage
						var footer = domDialog.querySelector("footer>*");

						if (footer) {
							footer.classList.remove("sapContrast");
							footer.classList.remove("sapContrastPlus");
						}

						// necessary since displaying a dialog within onInit or onAfterRendering would ignore dialogType = "Message"
					}, 50);
				}

				if (options.closeOnOuterTap) {
					document.onclick = function (sube) {
						if (sube.target.classList.contains("sapMDialogBlockLayerInit")) {
							var domDialogs = Array.prototype.slice.call(document.querySelectorAll("[class~=sapMDialog]"));
							var zIndices = domDialogs.reduce(function (acc, curval) {
								acc.push(curval.style.zIndex);

								return acc;
							}, []);
							var maxZIndex = Math.max.apply(null, zIndices);

							domDialog = domDialogs.find(function (node) {
								return node.style.zIndex === maxZIndex.toString();
							});
							dialog = sap.ui.getCore().byId(domDialog.id);

							if (dialog.getButtons().length === 0) {
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
						}
					};
				}
			});
			dialog.setEscapeHandler(function () {});

			_dialogs[dialogKey] = dialog;
		}

		if (options.autoOpen) {
			dialog.open();
		}

		return dialog;
	};

	return DialogUtils;
});