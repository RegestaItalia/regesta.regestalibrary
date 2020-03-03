/**
 * Extends an sap.m.Panel, removing padding.
 * 
 * @member RegPanel
 * @memberof regesta.regestalibrary.control
 */
 
sap.ui.define([
	"sap/m/Panel"
], function (Panel) {
	"use strict";

	return Panel.extend("regesta.regestalibrary.control.RegPanel", {
		renderer: function (rm, visibilityPanel) {
			// REDEFINITIONS >>
			this.startPanel = function () {
				rm.write("<div");
				rm.writeControlData(visibilityPanel);
				rm.addClass("sapMPanel");
				rm.addClass("sapUiNoContentPadding");
				rm.writeClasses();
				rm.addStyle("width", visibilityPanel.getWidth());
				rm.addStyle("height", visibilityPanel.getHeight());
				rm.writeStyles();
				rm.writeAccessibilityState(visibilityPanel, {
					role: visibilityPanel.getAccessibleRole().toLowerCase(),
					labelledby: visibilityPanel._getLabellingElementId()
				});
				rm.write(">");
			};
			// REDEFINITIONS <<
			
			visibilityPanel.setProperty("backgroundDesign", "Transparent");

			this.startPanel(rm, visibilityPanel);
			this.renderHeader(rm, visibilityPanel);
			this.renderContent(rm, visibilityPanel);
			this.endPanel(rm);
		}
	});
});