/** 
 * Helper for service-related functionalities.
 * Automatically creates CRUD+Qs and FunctionImports async wrappers basing on service metadata.
 * 
 * @class regesta.regestalibrary.helper.v2.ServiceHelper
 * @memberof regesta.regestalibrary.helper.v2
 */

sap.ui.define([
    "sap/ui/base/Object",
    "regesta/regestalibrary/helper/ModelHelper"
],
    function (Object, ModelHelper) {
        "use strict";

        var external = {};

        function buildEntityKey(keys, url) {
            var keyString = "";

            for (var key in keys) {
                keyString += "," + key + "='" + keys[key] + "'";
            }

            url += "(" + keyString.substr(1) + ")";

            return url;
        };
        function getModel(context, name) {
            var contextIsComponent = context instanceof sap.ui.core.Component;
            var model = (contextIsComponent ? context : context.getOwnerComponent()).getModel(name);

            return model;
        };
        function injectCallStubs(target, entitySets, functionImports) {
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

                target["query_" + entitySet.name] = stubQueryCall(entitySet);
                target["get_" + entitySet.name] = stubGetCall(entitySet);

                if (isCreatable) {
                    target["create_" + entitySet.name] = stubCreateCall(entitySet);
                }

                if (isUpdatable) {
                    target["update_" + entitySet.name] = stubUpdateCall(entitySet);
                }

                if (isDeletable) {
                    target["remove_" + entitySet.name] = stubRemoveCall(entitySet);
                }
            }.bind(target));

            functionImports.forEach(function (functionImport) {
                target[functionImport.name] = stubFunctionImport(functionImport);
            }.bind(target));
        };
        function stubCreateCall(entitySet) {
            return function (newData, options, callers) {
                var url = "/" + entitySet.name;

                return ModelHelper.createAsync(external.model, external.i18n, url, newData, options, callers);
            };
        };
        function stubFunctionImport(functionImport) {
            return function (options, callers) {
                var url = "/" + functionImport.name;

                return ModelHelper.readAsync(external.model, external.i18n, url, options, callers);
            };
        };
        function stubGetCall(entitySet) {
            return function (keys, options, callers) {
                var url = "/" + entitySet.name;

                buildEntityKey(keys, url);

                return ModelHelper.readAsync(external.model, external.i18n, url, options, callers);
            };
        };
        function stubQueryCall(entitySet) {
            return function (options, callers) {
                var url = "/" + entitySet.name;

                return ModelHelper.readAsync(external.model, external.i18n, url, options, callers);
            };
        };
        function stubRemoveCall(entitySet) {
            return function (keys, options, callers) {
                var url = "/" + entitySet.name;

                buildEntityKey(keys, url);

                return ModelHelper.removeAsync(external.model, external.i18n, url, options, callers);
            };
        };
        function stubUpdateCall(entitySet) {
            return function (keys, newData, options, callers) {
                var url = "/" + entitySet.name;

                buildEntityKey(keys, url);

                return ModelHelper.updateAsync(external.model, external.i18n, url, newData, options, callers);
            };
        };

        return Object.extend("regesta.regestalibrary.helper.v2.ServiceHelper", {
            constructor: function (context, options) {
                options = options || {
                    i18nName: "i18n"
                }

                external.model = getModel(context, options.modelName);
                external.i18n = getModel(context, options.i18nName).getResourceBundle();

                var serviceMetadata = external.model.getServiceMetadata();

                if (!serviceMetadata) {
                    return; // todo get metadata from model metadataLoaded event
                }

                var entityContainer = serviceMetadata.dataServices.schema[0].entityContainer[0]
                var entitySets = entityContainer.entitySet;
                var functionImports = entityContainer.functionImport;

                injectCallStubs(this, entitySets, functionImports);
            }
        });
    });