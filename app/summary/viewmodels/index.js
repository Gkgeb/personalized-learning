define(['entities/course', 'knockout', '_', 'windowOperations'],
    function (course, ko, _, windowOperations) {
        "use strict";

        var self = {
            isCourseFinished: false
        }

        var viewModel = {
            activate: activate,

            sections: [],
            progress: 0,

            isSendingResults: ko.observable(false),

            isClosing: ko.observable(false),
            isClosed: ko.observable(false),
            close: close
        };

        return viewModel;

        function activate() {
            viewModel.sections = _.map(course.sections, function (section) {
                return { title: section.title, score: section.score() };
            });
            viewModel.progress = course.score();
            viewModel.isSendingResults(true);

            course.finish().then(function () {
                self.isCourseFinished = true;
            }).fail(function (reason) {
                windowOperations.alert(reason);
            }).fin(function () {
                viewModel.isSendingResults(false);
            });
        }

        function close() {
            if (viewModel.isClosed()) {
                return;
            }

            viewModel.isClosing(true);

            if (self.isCourseFinished) {                
                viewModel.isClosing(false);
                course.close().then(function() {
                    windowOperations.close(function() { viewModel.isClosed(true); });
                });
            } else {
                setTimeout(close, 100);
            }
        }
    }
);