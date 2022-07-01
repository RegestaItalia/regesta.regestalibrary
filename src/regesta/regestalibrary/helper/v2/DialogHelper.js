/** 
 * Helper class for dialogs.
 * 
 * @class regesta.regestalibrary.helper.v2.DialogHelper
 * @memberof regesta.regestalibrary.helper.v2
 * @hideconstructor
 */

sap.ui.define([
    "regesta/regestalibrary/helper/UiHelper",
    "regesta/regestalibrary/helper/v2/Utils",
    "sap/m/ButtonType",
    "sap/m/Dialog",
    "sap/ui/base/Object",
    "sap/ui/core/CustomData",
    "sap/ui/core/ValueState"
], function (UiHelper, Utils, ButtonType, Dialog, Object, CustomData, ValueState) {
    "use strict";

    var external = {};

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
                    };

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
    };
    function showConfirmAsync(message, isConfirmable, invertActions) {
        isConfirmable = true;

        return showMessageAsync(message, "confirm", isConfirmable, invertActions);
    };
    function show(dialogOptions, customOptions) {
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

            customOptions.addPadding
        } else if (isFragment) {
            dialogOptions.content = sap.ui.xmlfragment(customOptions.fragmentPath, external.context);
        }

        var dialog = new Dialog(dialogOptions);

        if (customOptions.addPadding) {
            dialog.addStyleClass("sapUiContentPadding");
        }

        if (external.context && external.context.getView) {
            external.context.getView().addDependent(dialog);
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
    function showErrorAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "error", isConfirmable, invertActions);
    };
    function showInfoAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "info", isConfirmable, invertActions);
    };
    function showMessageAsync(message, type, isConfirmable, invertActions) {
        var icon;
        var title;
        var state;
        var createButtons = function (resolve, reject, isConfirmable) {
            var buttons = [];
            var createButton = function (type, callback) {
                var text;
                var type;

                switch (type) {
                    case "close":
                        text = Utils.getLibraryText("MSGBOX_CLOSE");
                        type = ButtonType.Default;

                        break;
                    case "ok":
                        text = Utils.getLibraryText("MSGBOX_OK");
                        type = ButtonType.Emphasized;

                        break;
                    case "cancel":
                        text = Utils.getLibraryText("MSGBOX_CANCEL");
                        type = ButtonType.Default;

                        break;
                }

                var button = new sap.m.Button({
                    text: text,
                    press: function (e) {
                        var dialog = UiHelper.getParentOfType(e.getSource(), "sap.m.Dialog");

                        dialog.close();

                        callback();
                    },
                    type: type
                });

                return button;
            }

            if (isConfirmable) {
                buttons.push(createButton("ok", resolve));
                buttons.push(createButton("cancel", reject));

                if (invertActions) {
                    buttons.reverse();
                }
            } else {
                buttons.push(createButton("close", resolve));
            }

            return buttons;
        }

        switch (type) {
            case "error":
                icon = "sap-icon://message-error";
                title = Utils.getLibraryText("MSGBOX_TITLE_ERROR");
                state = ValueState.Error;

                break;
            case "warning":
                icon = "sap-icon://message-warning";
                title = Utils.getLibraryText("MSGBOX_TITLE_WARNING");
                state = ValueState.Warning;

                break;
            case "success":
                icon = "sap-icon://message-success";
                title = Utils.getLibraryText("MSGBOX_TITLE_SUCCESS");
                state = ValueState.Success;

                break;
            case "info":
                icon = "sap-icon://message-information";
                title = Utils.getLibraryText("MSGBOX_TITLE_INFO");
                state = ValueState.Information;

                break;
            case "confirm":
                icon = "sap-icon://question-mark";
                title = Utils.getLibraryText("MSGBOX_TITLE_CONFIRM");
                state = ValueState.None;

                break;
        }

        return new Promise(function (resolve, reject) {
            show({
                icon: icon,
                title: title,
                content: message,
                buttons: createButtons(resolve, reject, isConfirmable),
                type: "Message",
                state: state,
                resizable: false
            });
        }.bind(this))
    };
    function showSuccessAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "success", isConfirmable, invertActions);
    };
    function showWarningAsync(message, isConfirmable, invertActions) {
        return showMessageAsync(message, "warning", isConfirmable, invertActions);
    };

    return Object.extend("regesta.regestalibrary.helper.v2.ServiceHelper", {
        constructor: function (context) {
            external.context = context
        },

        showConfirmAsync: showConfirmAsync,
        show: show,
        showErrorAsync: showErrorAsync,
        showInfoAsync: showInfoAsync,
        showSuccessAsync: showSuccessAsync,
        showWarningAsync: showWarningAsync
    });
});