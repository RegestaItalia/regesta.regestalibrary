sap.ui.define([
    "regesta/regestalibrary/helper/v2/MessageHelper",
    "regesta/regestalibrary/helper/v2/Utils"
],
    function (MessageHelper, Utils) {
        "use strict";

        function callErrorStub(url, customOptions, callback) {
            return function (response) {
                Utils.showBusy(customOptions.busyBindings, true);

                var parsedResponse = parseResponseMessage(response);

                MessageHelper.removeMessages({
                    targets: url
                });

                MessageHelper.addTargetsMessages(customOptions.messageTargets, {
                    message: parsedResponse,
                    type: "Error"
                });

                if (callback) {
                    callback(parsedResponse, response);
                }
            };
        }
        function callFunction(model, url, callOptions, customOptions) {
            makeCall({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "functionImport"
            });
        }
        function callFunctionAsync(model, url, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "functionImport"
            });
        }
        function callSuccessStub(customOptions, callback) {
            return function (data) {
                Utils.showBusy(customOptions.busyBindings, true);

                if (callback) {
                    callback(data.results || data); // <-- getEntitySet || getEntity
                }
            };
        }
        function create(model, url, newData, callOptions, customOptions) {
            makeCall({
                model: model,
                url: url,
                newData: newData,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "create"
            });
        }
        function createAsync(model, url, newData, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                url: url,
                newData: newData,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "create"
            });
        }
        function _fetch(url, callOptions, customOptions) {
            makeCall({
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                callType: "fetch"
            });
        }
        function fetchAsync(url, callOptions, customOptions) {
            return makeCallAsync({
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                callType: "fetch"
            });
        }
        function getModel(context, name) {
            var contextIsComponent = context instanceof sap.ui.core.Component;
            var model = (contextIsComponent ? context : context.getOwnerComponent()).getModel(name);

            return model;
        }
        function makeCall(args) {
            args = args || {};
            args.callOptions = args.callOptions || {};
            args.customOptions = args.customOptions || {};
            args.customOptions.busyBindings = Utils.toArray(args.customOptions.busyBindings);
            args.customOptions.messageTargets = Utils.toArray(args.customOptions.messageTargets);

            if (args.customOptions.messageTargets.length === 0) {
                args.customOptions.messageTargets = [args.url];
            }

            var providedSuccess = args.callOptions.success;
            var providedError = args.callOptions.error;

            args.callOptions.success = callSuccessStub(args.customOptions, providedSuccess).bind(this);
            args.callOptions.error = callErrorStub(args.url, args.customOptions, providedError).bind(this);

            if(!args.customOptions.noBusy){
                Utils.showBusy(args.customOptions.busyBindings);
            }

            MessageHelper.removeTargetsMessages(args.customOptions.messageTargets);

            switch (args.callType) {
                case "create":
                    args.model.create(args.url, args.newData, args.callOptions);

                    break;
                case "fetch":
                    fetch(args.url, args.callOptions).then(function (response) {
                        if (response.ok) {
                            return response.text();
                        } else {
                            args.callOptions.error(/* TODO */);
                        }
                    }).then(function (text) {
                        args.callOptions.success(text);
                    });

                    break;
                case "functionImport":
                    args.model.callFunction(args.url, args.callOptions);

                    break;
                case "read":
                    args.model.read(args.url, args.callOptions);

                    break;
                case "remove":
                    args.model.remove(args.url, args.callOptions);

                    break;
                case "submitChanges":
                    args.model.submitChanges(args.callOptions);

                    break;
                case "update":
                    args.model.update(args.url, args.newData, args.callOptions);

                    break;
            }
        }
        function makeCallAsync(args) {
            args = args || {};
            args.callOptions = args.callOptions || {};

            return new Promise(function (resolve, reject) {
                args.callOptions.success = resolve;
                args.callOptions.error = reject;

                makeCall(args);
            });
        }
        function parseResponseMessage(response) {
            var parsedResponse = "No response";

            try {
                try {
                    parsedResponse = JSON.parse(response.responseText).error.message.value;
                } catch (exc) {
                    parsedResponse = new DOMParser().parseFromString(response.responseText, "text/xml").getElementsByTagName("message")[0].innerHTML.trim();
                }
            } catch (exc) {
                parsedResponse = "Generic error";
            }

            return parsedResponse;
        }
        function read(model, url, callOptions, customOptions) {
            makeCall({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                callType: "read"
            });
        }
        function readAsync(model, url, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                callType: "read"
            });
        }
        function remove(model, url, callOptions, customOptions) {
            makeCall({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "remove"
            });
        }
        function removeAsync(model, url, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                url: url,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "remove"
            });
        }
        function submitChanges(model, callOptions, customOptions) {
            makeCall({
                model: model,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "submitChanges"
            });
        }
        function submitChangesAsync(model, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "submitChanges"
            });
        }
        function update(model, url, newData, callOptions, customOptions) {
            makeCall({
                model: model,
                url: url,
                newData: newData,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "update"
            });
        }
        function updateAsync(model, url, newData, callOptions, customOptions) {
            return makeCallAsync({
                model: model,
                url: url,
                newData: newData,
                callOptions: callOptions,
                customOptions: customOptions,
                type: "update"
            });
        }

        return {
            callFunction: callFunction,
            callFunctionAsync: callFunctionAsync,
            create: create,
            createAsync: createAsync,
            fetc: _fetch,
            fetchAsync: fetchAsync,
            getModel: getModel,
            read: read,
            readAsync: readAsync,
            remove: remove,
            removeAsync: removeAsync,
            submitChanges: submitChanges,
            submitChangesAsync: submitChangesAsync,
            update: update,
            updateAsync: updateAsync
        };
    });