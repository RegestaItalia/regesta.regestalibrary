sap.ui.require(
	[
		"regesta/regestalibrary/js/JsHelper",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (JsHelper) {
		"use strict";
		QUnit.module("JsHelper", {
			setup: function () {},
			teardown: function () {}
		});

		QUnit.test("checkParameters", function (assert) {
			assert.deepEqual(function () {
				return JsHelper.checkParameters("test", [{
					name: "p1",
					value: "string",
					expected: ["string"]
				}, {
					name: "p2",
					value: 1234,
					expected: ["number"]
				}, {
					"name": "p3",
					value: [],
					expected: ["object", "array"]
				}]);
			}(), undefined, "Checking array of parameters");
		});
		QUnit.test("createObjectByPath", function (assert) {
			assert.deepEqual(function () {
				return JsHelper.createObjectByPath("/p1", "asd");
			}(), {
				p1: "asd"
			}, "Creating an object with a simple path");
			assert.deepEqual(function () {
				return JsHelper.createObjectByPath("/p1/np1", "asd");
			}(), {
				p1: {
					np1: "asd"
				}
			}, "Creating an object with a complex path");
		});
		QUnit.test("getObjectByPath", function (assert) {
			assert.deepEqual(function () {
				return JsHelper.getObjectByPath("sap/ui/model/type/Integer");
			}(), sap.ui.model.type.Integer, "Checking with undefined (window) scope");
		});
		QUnit.test("getObjectPropertyByIndex", function (assert) {
			assert.deepEqual(function () {
				return JsHelper.getObjectPropertyByIndex({
					p1: "asd",
					p2: "foo",
					p3: "bar"
				}, 2);
			}(), "bar", "Getting property of object");
		});
		QUnit.test("parseFormattedNumber", function (assert) {
			assert.deepEqual(function () {
				return JsHelper.parseFormattedNumber(1234.5);
			}(), 1234.5, "Parsing raw number");
			assert.deepEqual(function () {
				return JsHelper.parseFormattedNumber((1234.5).toLocaleString());
			}(), 1234.5, "Parsing formatted float (it locale with thousand separator)");
		});
		QUnit.test("parseXml", function (assert) {
			assert.deepEqual(function(){
				return JsHelper.parseXml("<body><head><title>asdfoobar</title><intro>welcome!</intro></head></body>", "intro");
			}(), "welcome!", "Parsing XML and getting a single node");
		});
		QUnit.test("replaceByIndex", function (assert) {
			assert.deepEqual(function(){
				return JsHelper.replaceByIndex("string{0}{1}", ["asd", "foo"]);
			}(), "stringasdfoo", "Replacing multiple positions");
		});
		QUnit.test("typeOf", function (assert) {
			assert.deepEqual(function(){
				return JsHelper.typeOf("1");
			}(), "string", "Checking type of string");
			assert.deepEqual(function(){
				return JsHelper.typeOf(1);
			}(), "number", "Checking type of number");
			assert.deepEqual(function(){
				return JsHelper.typeOf(true);
			}(), "boolean", "Checking type of boolean");
			assert.deepEqual(function(){
				return JsHelper.typeOf([]);
			}(), "array", "Checking type of array");
			assert.deepEqual(function(){
				return JsHelper.typeOf({});
			}(), "object", "Checking type of object");
			assert.deepEqual(function(){
				return JsHelper.typeOf(new Date());
			}(), "date", "Checking type of date");
		});
	}
);