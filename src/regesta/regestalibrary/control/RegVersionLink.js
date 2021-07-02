/**
 * Provide a link for displaying application and loaded libraries version.
 * 
 * @member regesta.regestalibrary.control.RegVersionLink
 * @memberof regesta.regestalibrary.control
 */

sap.ui.define([
	"regesta/regestalibrary/helper/UiHelper",
	"sap/m/Link"
], function (UiHelper, Link) {
	"use strict";

	return Link.extend("regesta.regestalibrary.control.RegVersionLink", {
		metadata: {
			properties: {
				namespaces: {
					type: "string",
					defaultValue: "regesta"
				}
			}
		},
		renderer: {},

		init: function () {
			if (Link.prototype.init) { // for compatibility with older versions, e.g. 1.52.40
				Link.prototype.init.apply(this);
			}

			this.attachPress(this.onPress);

			this.addStyleClass("sapUiTinyMarginBeginEnd");
		},

		onBeforeRendering: function () {
			Link.prototype.onBeforeRendering.apply(this, arguments);

			var view = UiHelper.getParentOfType(this, "sap.ui.core.mvc.XMLView");

			this.setText("v " + UiHelper.getAppVersion(view.getController()));
		},
		onPress: function () {
			var view = UiHelper.getParentOfType(this, "sap.ui.core.mvc.XMLView");
			var i18nb = view.getModel("regestalibraryi18n").getResourceBundle();
			var loadedLibraries = sap.ui.getCore().getLoadedLibraries();
			var namespaces = this.getNamespaces();
			var namespaceLibraries = Object.keys(loadedLibraries).reduce(function (acc, curr) {
				var namespace = curr.split(".")[0];
				var version = loadedLibraries[curr].version;

				if (namespaces.includes(namespace) && !acc.includes(curr) && version) {
					acc.push({
						name: curr,
						namespace: namespace,
						version: version
					});
				}

				return acc;
			}, []);
			var list = new sap.m.List();

			namespaceLibraries.sort();
			namespaceLibraries.forEach(function (library) {
				list.addItem(new sap.m.DisplayListItem({
					label: library.name,
					value: library.version
				}));
			});

			UiHelper.showDialog(this, list, {
				type: "Information",
				title: i18nb.getText("dialogVersionInformations"),
				closeText: i18nb.getText("dialogClose")
			});
		}
	});
});