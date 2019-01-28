/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library regesta.regestalibrary.
 */
sap.ui.define(["jquery.sap.global",
		"sap/ui/core/library"
	], // library dependency
	function ( /*jQuery*/ ) {

		"use strict";

		/**
		 * regesta custom library for user controls and functions
		 *
		 * @namespace
		 * @name regesta.regestalibrary
		 * @author SAP SE
		 * @version ${version}
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "regesta.regestalibrary",
			version: "${version}",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"regesta.regestalibrary.controls.RegInput",
				"regesta.regestalibrary.controls.RegSmartTable"
			],
			elements: []
		});

		/* eslint-disable */
		return regesta.regestalibrary;
		/* eslint-enable */

	}, /* bExport= */ false);