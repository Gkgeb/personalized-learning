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
            var promises = [];
            var content = [];

            _.each(contentBlocks, function (contentBlock, index) {
                promises.push(http.get(contentBlock, { dataType: 'html' }).then(function (loadedContent) {
                    content.push({
                        index: index,
                        content: loadedContent
                    });
                }));
            });


            return Q.all(promises).then(function () {
                that(_.chain(content)
                    .sortBy(function (item) { return item.index; })
                    .map(function (item) { return item.content; })
                    .value());

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

});