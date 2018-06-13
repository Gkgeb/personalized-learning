define(['jquery', 'eventManager', 'queryStringParameters'],
    function ($, eventManager, queryStringParameters) {
        'use strict';

        return {
            initialize: initialize
        };

        function initialize() {
            var ltiResultCallbackUrl = queryStringParameters.get('ltiResultCallbackUrl');
            if (!ltiResultCallbackUrl) {
                return;
            }

            eventManager.subscribeForEvent(eventManager.events.courseFinished)
                .then(onCourseFinished.bind(this, ltiResultCallbackUrl));
        }

        function onCourseFinished(ltiResultCallbackUrl, course) {
            var url = new URL(ltiResultCallbackUrl);
            url.searchParams.append('score', course.score() / 100);

            $.ajax({
                url: url.toString(),
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                }
            });
        }

    }
);