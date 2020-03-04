/**
 * Provides control regesta.regestalibrary.RegInput.
 * 
 * @member regesta.regestalibrary.control.RegSmartTable
 * @memberof regesta.regestalibrary.control
 */
sap.ui.define(["jquery.sap.global", "./../library", "sap/ui/comp/smarttable/SmartTable", "sap/m/MessageBox"],

	function (jQuery, library, SmartTable, MessageBox) {
		"use strict";

		var RegSmartTable = SmartTable.extend("regesta.regestalibrary.control.RegSmartTable", {
			metadata: {
				library: "regesta.regestalibrary",
				properties: {
					"exportVisibleColumns": {
						type: "string",
						defaultValue: false
					}
				}
			},

			renderer: {},

			_addExportToExcelToToolbar: function () {
				if (this.getUseExportToExcel() && this._bTableSupportsExcelExport) {
					var that = this;
					if (!this._oUseExportToExcel) {
						this._oUseExportToExcel = new sap.m.Button({
							type: sap.m.ButtonType.Default,
							icon: "sap-icon://excel-attachment",
							tooltip: sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("TABLE_EXPORT_TEXT"),
							press: function (oEvent) {

								var fDownloadXls = function () {
									var oRowBinding = that._getRowBinding();
									var sUrl = oRowBinding.getDownloadUrl("xlsx");
									sUrl = that._adjustUrlToVisibleColumns(sUrl);
									sUrl = that._removeExpandParameter(sUrl);
									window.open(sUrl);
								};

								var iRowCount = that._getRowCount();

								if (iRowCount > 10000) {
									MessageBox.confirm(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("DOWNLOAD_CONFIRMATION_TEXT",
										iRowCount), {
										actions: [

											MessageBox.Action.YES, MessageBox.Action.NO
										],
										onClose: function (oAction) {
											if (oAction === MessageBox.Action.YES) {
												fDownloadXls();
											}
										}
									});
								} else {
									fDownloadXls();
								}
							}
						});
						this._setExcelExportEnableState();
					}

					this._oToolbar.addContent(this._oUseExportToExcel);
				} else if (this._oUseExportToExcel) {
					this._oToolbar.removeContent(this._oUseExportToExcel);
				}
			}
		});

		return RegSmartTable;
	}, /* bExport= */
	true);