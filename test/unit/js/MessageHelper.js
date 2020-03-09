sap.ui.require(
	[
		"regesta/regestalibrary/helper/MessageHelper",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (MessageHelper) {
		"use strict";
		QUnit.module("MessageHelper", {
			setup: function () {},
			teardown: function () {}
		});

		QUnit.test("addMessages", function (assert) {
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addMessages({
					message: "asd"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 1, "Adding a single message");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addMessages([{
					message: "foo"
				}, {
					message: "bar"
				}]);

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Adding multiple messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addErrorMessages({
					message: "asd"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return message.type === sap.ui.core.MessageType.Error;
				}).length;
			}(), 1, "Adding an error message");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addInformationMessages({
					message: "asd"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return message.type === sap.ui.core.MessageType.Information;
				}).length;
			}(), 1, "Adding an information message");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addSuccessMessages({
					message: "asd"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return message.type === sap.ui.core.MessageType.Success;
				}).length;
			}(), 1, "Adding a success message");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addWarningMessages({
					message: "asd"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return message.type === sap.ui.core.MessageType.Warning;
				}).length;
			}(), 1, "Adding a warning message");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addMessages({
					message: "asd",
					target: "doe"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return message.target === "doe";
				}).length;
			}(), 1, "Adding target messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addMessages({
					message: "asd",
					technical: true
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return !!message.technical;
				}).length;
			}(), 1, "Adding a technical messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				MessageHelper.addMessages({
					message: "asd",
					technical: false
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").filter(function (message) {
					return !message.technical;
				}).length;
			}(), 1, "Adding a business messages");
		});
		QUnit.test("getMessages", function (assert) {
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo"
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);

				return MessageHelper.getMessages().length;
			}(), 3, "Getting all messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					type: sap.ui.core.MessageType.Error
				}), new sap.ui.core.message.Message({
					message: "foo"
				})]);

				return MessageHelper.getErrorMessages().length;
			}(), 1, "Getting error messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					type: sap.ui.core.MessageType.Information
				}), new sap.ui.core.message.Message({
					message: "foo"
				})]);

				return MessageHelper.getInformationMessages().length;
			}(), 1, "Getting information messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					type: sap.ui.core.MessageType.Success
				}), new sap.ui.core.message.Message({
					message: "foo"
				})]);

				return MessageHelper.getSuccessMessages().length;
			}(), 1, "Getting success messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					type: sap.ui.core.MessageType.Warning
				}), new sap.ui.core.message.Message({
					message: "foo"
				})]);

				return MessageHelper.getWarningMessages().length;
			}(), 1, "Getting warning messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					target: "foo"
				}), new sap.ui.core.message.Message({
					message: "foo"
				})]);

				return MessageHelper.getMessages({
					targets: "foo"
				}).length;
			}(), 1, "Getting a target messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					technical: true
				}), new sap.ui.core.message.Message({
					message: "foo"
				}), new sap.ui.core.message.Message({
					message: "foo",
					technical: false
				})]);

				return MessageHelper.getMessages({
					technical: true
				}).length;
			}(), 1, "Getting technical messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd",
					technical: true
				}), new sap.ui.core.message.Message({
					message: "foo"
				}), new sap.ui.core.message.Message({
					message: "foo",
					technical: false
				})]);

				return MessageHelper.getMessages({
					technical: false
				}).length;
			}(), 2, "Getting business messages");
		});
		QUnit.test("removeMessages", function (assert) {
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Error
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeMessages();

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 0, "Removing all messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Error
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeErrorMessages();

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing error messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Information
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeInformationMessages();

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing information messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Success
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeSuccessMessages();

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing success messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Warning
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeWarningMessages();

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing warning messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Warning
				}), new sap.ui.core.message.Message({
					message: "bar",
					target: "doe"
				})]);
				
				MessageHelper.removeMessages({
					targets: "doe"
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing target messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Warning
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeMessages({
					technical: true
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 2, "Removing technical messages");
			assert.deepEqual(function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.getCore().getMessageManager().addMessages([new sap.ui.core.message.Message({
					message: "asd"
				}), new sap.ui.core.message.Message({
					message: "foo",
					type: sap.ui.core.MessageType.Warning
				}), new sap.ui.core.message.Message({
					message: "bar",
					technical: true
				})]);
				
				MessageHelper.removeMessages({
					technical: false
				});

				return sap.ui.getCore().getMessageManager().getMessageModel().getProperty("/").length;
			}(), 1, "Removing business messages");
		});
	});