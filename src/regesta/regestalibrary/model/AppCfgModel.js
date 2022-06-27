sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";
    return JSONModel.extend("regesta.regestalibrary.model.AppCfgModel", {
        constructor: function (vServiceUrl, mParameters) {
            this._serviceModel = new sap.ui.model.odata.v2.ODataModel(vServiceUrl, mParameters);
            JSONModel.prototype.constructor.apply(this, arguments);
        },
        loadData: function () {
            return this._setAppConfigData();
        },
        _setAppConfigData: function () {
            return new Promise(function (res, rej) {
                this._serviceModel.metadataLoaded().then(function () {
                    var metadata = this._serviceModel.getServiceMetadata();
                    var functionImports = this._getAppConfigFunctionImports(metadata);
                    var functionImport;
                    if (functionImports.length === 0) {
                        rej(new Error('Function import App_Config non trovato'));
                    } else if (functionImports.length === 1) {
                        functionImport = functionImports[0];
                    } else {
                        functionImport = functionImports.find(function (fi) {
                            return fi.name === mParameters.appConfigFI;
                        })
                        if (!functionImport) {
                            rej(new Error('Trovati multipli App_Config: ' + functionImports.join(', ')));
                        }
                    }
                    this._serviceModel.callFunction('/' + functionImport.name, {
                        method: functionImport.httpMethod,
                        success: function (data) {
                            var jsonCfg = $.parseJSON(data[functionImport.name].JsonCfg),
                                alinkCfg = $.parseJSON(jsonCfg.alinkCfg),
                                blClasCfg = $.parseJSON(jsonCfg.blClasCfg);
                            this.setProperty("/AlinkCfg", alinkCfg);
                            this.setProperty("/BlClassCfg", blClasCfg);
                            res();
                        }.bind(this),
                        error: function (oError) {
                            rej(oError);
                        }.bind(this)
                    });
                }.bind(this)).catch(function(oError){
                    rej(oError);
                });
            }.bind(this));
        },
        _getAppConfigFunctionImports: function (metadata) {
            var functionImports = [];
            metadata.dataServices.schema.forEach(function (schema) {
                if (schema.entityContainer) {
                    schema.entityContainer.forEach(function (entityContainer) {
                        if (entityContainer.functionImport) {
                            var entityContainerFi = entityContainer.functionImport.filter(function (fi) {
                                return /App_config$/i.test(fi.name);
                            });
                            functionImports = functionImports.concat(entityContainerFi);
                        }
                    });
                }
            });
            return functionImports;
        },
    });
});