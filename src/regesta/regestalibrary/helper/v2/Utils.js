sap.ui.define([
    "sap/ui/model/Binding"
], function (Binding) {
    "use strict";

    function arrayIntersection(array1, array2) {
        var intersection = array1.filter(function (item) {
            return array2.includes(item);
        });

        return intersection.length === 0 ? false : intersection;
    }
    function getBindingPath(binding) {
        var context = binding.getContext();
        var path = binding.getPath();
        var deepPath = context ? context.getDeepPath() : "";

        return deepPath + "/" + path;
    }
    function getLibraryText(key, library) {
        library = library || "sap.m";

        var text = sap.ui.getCore().getLibraryResourceBundle(library).getText(key);

        return text;
    }
    function showBusy(bindings, unset) {
        bindings = toArray(bindings);

        if (bindings.length > 0) {
            bindings.forEach(function (binding) {
                if (binding instanceof Binding) {
                    var model = binding.getModel();
                    var path = getBindingPath(binding);
                    var value = unset ? false : true;

                    model.setProperty(path, value);
                }
            });
        } else {
            var method = unset ? "hide" : "show";

            sap.ui.core.BusyIndicator[method](0);
        }
    }
    function toArray(object) {
        var array = object || [];

        if (!(array instanceof Array)) {
            array = [object];
        }

        return array;
    }

    return {
        arrayIntersection: arrayIntersection,
        getBindingPath: getBindingPath,
        getLibraryText: getLibraryText,
        showBusy: showBusy,
        toArray: toArray
    };
});