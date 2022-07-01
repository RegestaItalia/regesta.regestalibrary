/** 
 * Basic helper functions.
 * 
 * @class regesta.regestalibrary.helper.V2.Utils
 * @memberof regesta.regestalibrary.helper.V2
 * @hideconstructor
 */

sap.ui.define([], function () {
	"use strict";

	return {
		getLibraryText: function(key, library){
            library = library || "sap.m"

            var text = sap.ui.getCore().getLibraryResourceBundle(library).getText(key);

            return text;
        }
	};
});