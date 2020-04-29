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
		
		/** @namespace regesta.regestalibrary.control */
		/** @namespace regesta.regestalibrary.enum */
		/** @namespace regesta.regestalibrary.helper */
		/** @namespace regesta.regestalibrary.type */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "regesta.regestalibrary",
			// version: "${version}",
			version: "1.0.1",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"regesta.regestalibrary.control.RegInput",
				"regesta.regestalibrary.control.RegSmartTable",
				"regesta.regestalibrary.control.RegCharContainer",
				"regesta.regestalibrary.control.RegCharItem"
			],
			elements: []
		});

		/* eslint-disable */
		return regesta.regestalibrary;
		/* eslint-enable */

	}, /* bExport= */ false);