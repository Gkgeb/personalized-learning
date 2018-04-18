define(['knockout', 'Q', 'plugins/http'], function (ko, Q, http) {

    return function (question) {
        this.id = question.id;
        this.title = question.title;

        this.isAnswered = ko.observable(false);
        this.isAnsweredCorrectly = ko.observable(false);
        this.isSurveyMode = question.hasOwnProperty('isSurvey') && question.isSurvey;
        this.learningContent = ko.observableArray([]);
        this.learningContent.load = function () {
            return loadContentBlocks.apply(this, [question.learningContents]);
        }

        this.questionInstructions = ko.observableArray([]);
        this.questionInstructions.load = function () {
            return loadContentBlocks.apply(this, [question.questionInstructions]);
        }

        function loadContentBlocks(contentBlocks) {
            var that = this;
            return loadContent(contentBlocks).then(function () {
                that(contentBlocks);

            })
            ["catch"](function (reason) {
                console.error(reason);
            });
        }

        this.correctFeedback = ko.observable();
        this.correctFeedback.load = function () {
            var that = this;

            return Q.fcall(function() {
                if (!question.correctFeedback) {
                    return null;
                }

                return http.get(question.correctFeedback, { dataType: 'html' }).then(function (feedback) {
                    that(feedback);
                });
            });

        }

        this.incorrectFeedback = ko.observable();
        this.incorrectFeedback.load = function () {
            var that = this;

            return Q.fcall(function () {
                if (!question.incorrectFeedback) {
                    return null;
                }

                return http.get(question.incorrectFeedback, { dataType: 'html' }).then(function (feedback) {
                    that(feedback);
                });
            });
        }
    }

    function loadContent(items) {
        var promises = [];

        _.each(items, function (item) {
            if(typeof item.content === typeof undefined) {
                promises.push(http.get(item.contentUrl, { dataType: 'html' }).then(function (content) {
                    item.content = content;
                }));
            }

            promises.push(loadContent(item.children));
        });

        return Q.all(promises);
    }
});