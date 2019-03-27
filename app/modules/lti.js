define(['Q', 'jquery', 'eventManager', 'queryStringParameters'],
    function (Q, $, eventManager, queryStringParameters) {
        'use strict';

        var constants = {
            sendResultAttemptsTimeout: 10000,
            sendResultAttemptsCount: 10,
            resultCallbackUrlParameterName: 'ltiResultCallbackUrl',
            errorMessage: 'Something went wrong and your final score has not been reported ' + 
                '(reason: LTI reporting failed). Please contact the author of the course.'
        };

        return {
            initialize: initialize
        };

        function initialize() {
            var resultCallbackUrl = queryStringParameters.get(constants.resultCallbackUrlParameterName);
            if (!resultCallbackUrl) {
                return;
            }

            eventManager.subscribeForEvent(eventManager.events.courseFinished)
                .then(onCourseFinished.bind(this, resultCallbackUrl));
        }

        function onCourseFinished(resultCallbackUrl, course) {
            var requestParams = {
                url: resultCallbackUrl,
                method: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    score: course.score() / 100
                }
            };

            var token = queryStringParameters.get('token');
            if (token) {
                requestParams.headers = {
                    Authorization: 'Bearer ' + token
                };
            }

            return sendRequest(requestParams);
        }

        function sendRequest(params, attemptNumber, defer) {
            if (typeof defer === 'undefined') {
                defer = Q.defer();
            }

            if (typeof attemptNumber === 'undefined') {
                attemptNumber = 0;
            }

            $.ajax(params).done(function() {
                defer.resolve();
            }).fail(function () {
                if (attemptNumber >= constants.sendResultAttemptsCount) {
                    return defer.reject(constants.errorMessage);
                }

                setTimeout(function () {
                    sendRequest(params, ++attemptNumber, defer);
                }, constants.sendResultAttemptsTimeout);
            });

            return defer.promise;
        }
    }
);