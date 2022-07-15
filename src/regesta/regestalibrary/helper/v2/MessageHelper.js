sap.ui.define([
    "sap/ui/core/message/Message",
    "regesta/regestalibrary/helper/v2/Utils"
],
    function (Message, Utils) {
        "use strict";

        function addTargetsMessages(messageTargets, messagesOptions) {
            messageTargets = Utils.toArray(messageTargets);
            messagesOptions = Utils.toArray(messagesOptions);

            var messageManager = getMessageManager();
            var messages = messageTargets.reduce(function (acc, messageTarget) {
                var messages = messagesOptions.reduce(function (acc2, messageOptions) {
                    if (messageTarget instanceof Object) {
                        messageOptions.target = messageTarget.target;
                        messageOptions.processor = messageTarget.processor;
                    } else {
                        messageOptions.target = messageTarget;
                    }

                    var message = new Message(messageOptions);

                    acc2.push(message);

                    return acc2;
                }, []);

                acc = acc.concat(messages);

                return acc;
            }, []);

            messageManager.addMessages(messages);
        }
        function createMessageTargets(bindings) {
            bindings = Utils.toArray(bindings);

            var messageTargets = bindings.reduce(function (acc, binding) {
                var messageTarget = {
                    target: Utils.getBindingPath(binding),
                    processor: binding.getModel()
                };

                acc.push(messageTarget);

                return acc;
            }, []);

            return messageTargets;
        }
        function createMessagesFromOptions(messagesOptions) {
            var messages = messagesOptions.reduce(function (acc, messageOptions) {
                var message = new Message(messageOptions);

                acc.push(message);

                return acc;
            }, []);

            return messages;
        }
        function getMessageManager() {
            var messageManager = sap.ui.getCore().getMessageManager();

            return messageManager;
        }
        function getMessages(options) {
            options = options || {};
            options.types = options.types || [];
            options.targets = options.targets || [];

            if (!(options.types instanceof Array)) {
                options.types = [options.types];
            }
            if (!(options.targets instanceof Array)) {
                options.targets = [options.targets];
            }

            var allTypes = options.types.length === 0;
            var allTargets = options.targets.length === 0;
            var messageManager = getMessageManager();
            var messageModel = messageManager.getMessageModel();
            var messages = messageModel.getData();
            var weights = {
                "Error": 0,
                "Warning": 1,
                "Success": 2,
                "Information": 3,
                "None": 4
            };

            messages = messages.reduce(function (acc, message) {
                var check = true;

                if (!allTypes && !options.types.includes(message.getType())) {
                    check = false;
                }
                if (!allTargets && !Utils.arrayIntersection(options.targets, message.getTargets())) {
                    check = false;
                }
                if (options.group && acc.find(function (iteration) {
                    var sameMessage = iteration.getMessage() === message.getMessage();
                    var sameTargets = Utils.arrayIntersection(iteration.getTargets(), message.getTargets());
                    var sameProcessor = iteration.getMessageProcessor() === message.getMessageProcessor();

                    return sameMessage && sameTargets && sameProcessor;
                })) {
                    check = false;
                }

                if (check) {
                    acc.push(message);
                }

                return acc;
            }, []);

            messages = messages.sort((message1, message2) => {
                var weight1 = weights[message1.getType()];
                var weight2 = weights[message2.getType()];

                return weight1 > weight2 ? 1 : -1;
            });

            return messages;
        }
        function getTargetsMessages(messageTargets) {
            var targets = messageTargets.reduce(function (acc, messageTarget) {
                var target = messageTarget.target;

                acc.push(target);

                return acc;
            }, []);

            var messages = getMessages({
                targets: targets
            });

            return messages;
        }
        function removeMessages(options) {
            var messageManager = getMessageManager();
            var messages = getMessages(options);

            messageManager.removeMessages(messages);
        }
        function removeTargetsMessages(messageTargets) {
            var messages = getTargetsMessages(messageTargets);
            var messageManager = getMessageManager();

            messageManager.removeMessages(messages);
        }

        return {
            addTargetsMessages: addTargetsMessages,
            createMessageTargets: createMessageTargets,
            createMessagesFromOptions: createMessagesFromOptions,
            getMessageManager: getMessageManager,
            getMessages: getMessages,
            getTargetsMessages: getTargetsMessages,
            removeMessages: removeMessages,
            removeTargetsMessages: removeTargetsMessages
        };
    });