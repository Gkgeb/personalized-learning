define(['entities/course', 'knockout', '_', 'windowOperations', 'constants', 'dialogs/dialog', 'modules/webhooks'],
    function (course, ko, _, windowOperations, constants, Dialog, webhooks) {
        "use strict";

        var self = {
            isCourseFinished: false
        }

        var viewModel = {
            activate: activate,

            sections: [],
            progress: 0,

            isSendingResults: ko.observable(false),
            resultsResendDialog: new Dialog(),
            webhooksSendingFailed: false,

            isClosing: ko.observable(false),
            isClosed: ko.observable(false),
            close: close
        };

        return viewModel;

        function activate() {
            viewModel.resultsResendDialog.isVisible(false);
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

                if (webhooks.initialized) {
                    sendWebhooks();
                }
            });
        }

        function sendWebhooks() {
            viewModel.isSendingResults(true);
            webhooks.sendResults(course)
                .catch(function(){
                    viewModel.resultsResendDialog.resultsSendErrorTitleKey = constants.dialogs.resendResults.webhooks.resultsSendErrorTitleKey;
                    viewModel.resultsResendDialog.endpointNameKey = constants.dialogs.resendResults.webhooks.endpointNameKey;
                    viewModel.resultsResendDialog.show({
                        resend: webhooks.sendResults.bind(webhooks),
                        onResendingSkip: webhooksSendingFailed,
                        closeCourse: close
                    });
                })
                .fin(function() {
                    viewModel.isSendingResults(false);
                });
        }

        function webhooksSendingFailed() {
            viewModel.webhooksSendingFailed = true;
        }

        function close() {
            if (viewModel.isClosed()) {
                return;
            }

            if (viewModel.webhooksSendingFailed) {
                viewModel.webhooksSendingFailed = false;
                sendWebhooks();
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