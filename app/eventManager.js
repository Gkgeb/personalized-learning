define(['durandal/app', 'Q'],
    function (app, Q) {
        "use strict";

        var
            events = {
                courseStarted: "course:started",
                courseFinished: "course:finished",
                courseFinalized: "course:finalized",
                questionAnswered: "question:answered",
                learningContentExperienced: "learningContent:experienced"
            },

            turnAllEventsOff = function () {
                _.each(events, function (event) {
                    app.off(event);
                });
            },

            subscribeForEvent = function (event) {
                if (!_.contains(_.values(events), event)) {
                    throw 'Unsupported event';
                }

                return app.on(event);
            },

            courseStarted = function () {
                app.trigger(events.courseStarted);
            },

            courseFinished = function (data) {
                return executeAfterSubscribersDone(events.courseFinished, data);
            },

            courseFinalized = function() {
                return executeAfterSubscribersDone(events.courseFinalized, {});
            },

            questionAnswered = function (data, preventSendingParentProgress) {
                app.trigger(events.questionAnswered, data, preventSendingParentProgress);
            },

            learningContentExperienced = function (data) {
                app.trigger(events.learningContentExperienced, data);
            },

            executeAfterSubscribersDone = function (event, eventData) {
                if (_.isUndefined(app.callbacks) || _.isUndefined(app.callbacks[event])) {
                    return Q();
                }

                var promises = [];
                _.each(app.callbacks[event], function (handler) {
                    if (_.isFunction(handler)) {
                        var promise = handler(eventData);

                        if (Q.isPromise(promise)) {
                            promises.push(promise);
                        }
                    }
                });

                return Q.all(promises);
            };

        return {
            events: events,
            turnAllEventsOff: turnAllEventsOff,
            subscribeForEvent: subscribeForEvent,

            courseStarted: courseStarted,
            courseFinished: courseFinished,
            courseFinalized: courseFinalized,
            questionAnswered: questionAnswered,
            learningContentExperienced: learningContentExperienced
        };
    }
);