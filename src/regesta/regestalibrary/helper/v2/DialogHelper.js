sap.ui.define([
    "regesta/regestalibrary/helper/UiHelper",
    "regesta/regestalibrary/helper/v2/MessageHelper",
    "regesta/regestalibrary/helper/v2/Utils",
    "sap/m/ButtonType",
    "sap/m/Dialog",
    "sap/ui/core/CustomData",
    "sap/ui/core/ValueState"
], function (UiHelper, MessageHelper, Utils, ButtonType, Dialog, CustomData, ValueState) {
    "use strict";

    var dialogTypeDefaults = {
        Error: {
            icon: "sap-icon://message-error",
            title: Utils.getLibraryText("MSGBOX_TITLE_ERROR"),
            state: ValueState.Error
        },
        Warning: {
            icon: "sap-icon://message-warning",
            title: Utils.getLibraryText("MSGBOX_TITLE_WARNING"),
            state: ValueState.Warning
        },
        Success: {
            icon: "sap-icon://message-success",
            title: Utils.getLibraryText("MSGBOX_TITLE_SUCCESS"),
            state: ValueState.Success
        },
        Info: {
            icon: "sap-icon://message-information",
            title: Utils.getLibraryText("MSGBOX_TITLE_INFO"),
            state: ValueState.Information
        },
        Confirm: {
            icon: "sap-icon://question-mark",
            title: Utils.getLibraryText("MSGBOX_TITLE_CONFIRM"),
            state: ValueState.None
        }
    };
    var buttonTypeDefaults = {
        Close: {
            text: Utils.getLibraryText("MSGBOX_CLOSE"),
            buttonType: ButtonType.Default
        },
        Ok: {
            text: Utils.getLibraryText("MSGBOX_OK"),
            buttonType: ButtonType.Emphasized
        },
        Cancel: {
            text: Utils.getLibraryText("MSGBOX_CANCEL"),
            buttonType: ButtonType.Default
        }
    };

    function createButton(type, callback) {
        var typeDefaults = buttonTypeDefaults[type];

        var button = new sap.m.Button({
            text: typeDefaults.text,
            type: typeDefaults.buttonType,
            press: function (e) {
                var dialog = UiHelper.getParentOfType(e.getSource(), "sap.m.Dialog");

                dialog.close();

                callback();
            }
        });

        return button;
    }
    function createButtons(resolve, reject, isConfirmable, invertActions) {
        var buttons = [];

        if (isConfirmable) {
            buttons.push(createButton("Ok", resolve));
            buttons.push(createButton("Cancel", reject));

            if (invertActions) {
                buttons.reverse();
            }
        } else {
            buttons.push(createButton("Close", resolve));
        }

        return buttons;
    }
    function outerTapHandler(domEvent) {
        var dialogsContainer = domEvent.currentTarget;
        var tapInsideDialog = domEvent.path.find(function (part) {
            return sap.ui.getCore().byId(part.id) instanceof sap.m.Dialog;
        });

        if (!tapInsideDialog) {
            var openDialogs = [];
            var maxZIndex = 0;

            for (var i = 0; i < dialogsContainer.childElementCount; i++) {
                var child = dialogsContainer.children[i];
                var targetControl = sap.ui.getCore().byId(child.id);

                if (targetControl && targetControl instanceof sap.m.Dialog) {
                    var zIndex = child.style.zIndex * 1;

                    if (zIndex > maxZIndex) {
                        maxZIndex = zIndex;
                    }

                    openDialogs.push({
                        domRef: child,
                        control: targetControl
                    });
                }
            }

            var targetDialog = openDialogs.find(function (dialog) {
                return dialog.domRef.style.zIndex == maxZIndex;
            });

            if (UiHelper.getCustomData(targetDialog.control, "canBeAborted")) {
                targetDialog.control.close();
            }
        }
    }
    function showConfirmAsync(message, isConfirmable, invertActions) {
        isConfirmable = true;

        return showMessageAsync(message, "Confirm", isConfirmable, invertActions);
    }
    function show(context, dialogOptions, customOptions) {
        dialogOptions = dialogOptions || {};
        customOptions = customOptions || {};

        var isMessage = !customOptions.fragmentPath && typeof dialogOptions.content === "string";
        var isFragment = customOptions.fragmentPath;

        dialogOptions.draggable = dialogOptions.draggable || dialogOptions.draggable != false;
        dialogOptions.resizable = dialogOptions.resizable || dialogOptions.resizable != false;
        dialogOptions.initialFocus = (dialogOptions.buttons || [])[0];

        customOptions.textAlign = customOptions.textAlign || "Center";
        customOptions.canBeAborted = customOptions.canBeAborted || customOptions.canBeAborted !== false;

        dialogOptions.customData = [
            new CustomData({
                key: "canBeAborted",
                value: customOptions.canBeAborted
            }),
        ];

        if (isMessage) {
            dialogOptions.content = new sap.m.Text({
                text: dialogOptions.content,
                width: "100%",
                textAlign: customOptions.textAlign
            });
        } else if (isFragment) {
            dialogOptions.content = sap.ui.xmlfragment(customOptions.fragmentPath, context);
        }

        var typeDefaults = dialogTypeDefaults[customOptions.type] || {};

        dialogOptions.title = dialogOptions.title || typeDefaults.title;
        dialogOptions.icon = dialogOptions.icon || typeDefaults.icon;
        dialogOptions.state = dialogOptions.state || typeDefaults.state;

        var dialog = new Dialog(dialogOptions);

        if (customOptions.addPadding || isMessage) {
            dialog.addStyleClass("sapUiContentPadding");
        }

        if (context && context.getView) {
            context.getView().addDependent(dialog);
        }

        dialog.attachAfterOpen(function (e) {
            var dialog = e.getSource();
            var dialogDomRef = dialog.getDomRef();
            var dialogContainer = dialogDomRef.parentElement;

            if (dialogContainer) {
                dialogContainer.onclick = outerTapHandler;
            }

            dialog.setEscapeHandler(function (escapePromise) {
                if (customOptions.canBeAborted) {
                    escapePromise.resolve();
                } else {
                    escapePromise.reject();
                }
            });
        });

        if (!customOptions.keepClosed) {
            dialog.open();
        }

        return dialog;
    }
    function showAsync(dialogOptions, customOptions) {
        dialogOptions = dialogOptions || {};
        customOptions = customOptions || {};

        return new Promise(function (resolve, reject) {
            dialogOptions.buttons = createButtons(resolve, reject, customOptions.isConfirmable, customOptions.invertActions);

            show(null, dialogOptions, customOptions);
        });
    }
    function showErrorAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "Error", isConfirmable, invertActions);
    }
    function showInfoAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "Info", isConfirmable, invertActions);
    }
    function showMessageAsync(content, type, isConfirmable, invertActions) {
        return showAsync({
            content: content,
            resizable: false
        }, {
            type: type,
            isConfirmable: isConfirmable,
            invertActions: invertActions,
        });
    }
    function showMessagesAsync(isConfirmable, invertActions) {
        var messages = MessageHelper.getMessages({
            group: true
        }) || [];

        if (messages.length === 0) {
            return Promise.resolve;
        }

        var content = new sap.m.List({
            items: {
                path: "/Messages",
                factory: function () {
                    return new sap.m.StandardListItem({
                        title: "{message}",
                        highlight: "{type}"
                    });
                }
            }
        });

        content.setModel(new sap.ui.model.json.JSONModel({
            Messages: messages
        }));

        return showMessageAsync(content, messages[0].type, isConfirmable, invertActions);
    }
    function showSuccessAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "Success", isConfirmable, invertActions);
    }
    function showWarningAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "Warning", isConfirmable, invertActions);
    }

    return {
        showConfirmAsync: showConfirmAsync,
        show: show,
        showAsync: showAsync,
        showErrorAsync: showErrorAsync,
        showInfoAsync: showInfoAsync,
        showMessagesAsync: showMessagesAsync,
        showSuccessAsync: showSuccessAsync,
        showWarningAsync: showWarningAsync
    };
});