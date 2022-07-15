sap.ui.define([
    "sap/ui/base/Object",
    "regesta/regestalibrary/helper/v2/ModelHelper"
],
    function (Object, ModelHelper) {
        "use strict";

        var external = {};
        var calls = {};

        function buildEntityKey(keys, url) {
            var keyString = "";

            for (var key in keys) {
                keyString += "," + key + "='" + keys[key] + "'";
            }

            url += "(" + keyString.substr(1) + ")";

            return url;
        }
        function createAsync(path, newData, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["create_" + path](newData, callOptions, customOptions);
            });
        }
        function createCallStub(entitySet) {
            return function (newData, options, customOptions) {
                var url = "/" + entitySet.name;

                return ModelHelper.createAsync(external.model, external.i18n, url, newData, options, customOptions);
            };
        }
        function deleteAsync(path, keys, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["delete_" + path](keys, callOptions, customOptions);
            });
        }
        function deleteCallStub(entitySet) {
            return function (keys, options, customOptions) {
                var url = "/" + entitySet.name;

                url = buildEntityKey(keys, url);

                return ModelHelper.removeAsync(external.model, external.i18n, url, options, customOptions);
            };
        }
        function functionImportAsync(path, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["functionImport_" + path](callOptions, customOptions);
            });
        }
        function functionImportCallStub(functionImport) {
            return function (options, customOptions) {
                var url = "/" + functionImport.name;

                return ModelHelper.readAsync(external.model, external.i18n, url, options, customOptions);
            };
        }
        function injectCallStubs(entitySets, functionImports) {
            entitySets.forEach(function (entitySet) {
                var isCreatable = !entitySet.extensions.find(function (extension) {
                    return extension.name === "creatable" && extension.value === "false";
                });
                var isUpdatable = !entitySet.extensions.find(function (extension) {
                    return extension.name === "updatable" && extension.value === "false";
                });
                var isDeletable = !entitySet.extensions.find(function (extension) {
                    return extension.name === "deletable" && extension.value === "false";
                });

                calls["query_" + entitySet.name] = queryCallStub(entitySet);
                calls["read_" + entitySet.name] = readCallStub(entitySet);

                if (isCreatable) {
                    calls["create_" + entitySet.name] = createCallStub(entitySet);
                }

                if (isUpdatable) {
                    calls["update_" + entitySet.name] = updateCallStub(entitySet);
                }

                if (isDeletable) {
                    calls["delete_" + entitySet.name] = deleteCallStub(entitySet);
                }
            });

            functionImports.forEach(function (functionImport) {
                calls[functionImport.name] = functionImportCallStub(functionImport);
            });
        }
        function queryAsync(path, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["query_" + path](callOptions, customOptions);
            });
        }
        function queryCallStub(entitySet) {
            return function (options, customOptions) {
                var url = "/" + entitySet.name;

                return ModelHelper.readAsync(url, options, customOptions);
            };
        }
        function readAsync(path, keys, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["read_" + path](keys, callOptions, customOptions);
            });
        }
        function readCallStub(entitySet) {
            return function (keys, callOptions, customOptions) {
                var url = "/" + entitySet.name;

                url = buildEntityKey(keys, url);

                return ModelHelper.readAsync(external.model, url, callOptions, customOptions);
            };
        }
        function updateAsync(path, keys, newData, callOptions, customOptions) {
            return waitInitAsync().then(function () {
                return calls["update_" + path](keys, newData, callOptions, customOptions);
            });
        }
        function updateCallStub(entitySet) {
            return function (keys, newData, options, customOptions) {
                var url = "/" + entitySet.name;

                url = buildEntityKey(keys, url);

                return ModelHelper.updateAsync(external.model, external.i18n, url, newData, options, customOptions);
            };
        }
        function waitInitAsync() {
            return new Promise(function (resolve) {
                var serviceMetadata = external.model.getServiceMetadata();

                if (serviceMetadata) {
                    resolve(serviceMetadata);
                } else {
                    external.model.attachMetadataLoaded(function (e) {
                        serviceMetadata = e.getParameter("metadata");

                        resolve(serviceMetadata);
                    });
                }
            }).then(function (serviceMetadata) {
                return new Promise(function (resolve) {
                    var entityContainer = serviceMetadata.dataServices.schema[0].entityContainer[0];
                    var entitySets = entityContainer.entitySet;
                    var functionImports = entityContainer.functionImport;

                    injectCallStubs(entitySets, functionImports);

                    resolve();
                });
            });
        }

        return Object.extend("regesta.regestalibrary.helper.v2.ServiceManager", {
            constructor: function (context, options) {
                options = options || {
                    i18nName: "i18n"
                };

                external.model = ModelHelper.getModel(context, options.modelName);
                external.i18nModel = ModelHelper.getModel(context, options.i18nName);
                external.i18n = external.i18nModel.getResourceBundle();
            },

            createAsync: createAsync,
            deleteAsync: deleteAsync,
            functionImportAsync: functionImportAsync,
            queryAsync: queryAsync,
            readAsync: readAsync,
            updateAsync: updateAsync
        });
    });