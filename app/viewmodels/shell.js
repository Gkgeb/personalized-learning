define(['knockout', 'durandal/app', 'controller', 'loader', 'templateSettings', 'background', 
'entities/course', 'modulesInitializer', 'progressContext', 'windowOperations', 'eventManager'],
 function (ko, app, controller, loader, templateSettings, background, 
    course, modulesInitializer, progressContext, windowOperations, eventManager) {
    "use strict";

    var viewModel = {
        title: course.title,
        moduleToInitialize: ko.observable(),
        activate: activate,
        logoUrl: ko.observable(),
        isCloseCoursePopupVisible: controller.inProgress,
        progressError:ko.observable(false),
        isFinishPopupVisible: ko.observable(false),
        openFinishPopup: openFinishPopup,
        closeFinishPopup: closeFinishPopup,
        finish: finish,
        close: close,
        isClosed: ko.observable(false),

        activeItem: controller.activeItem,
        compositionComplete: compositionComplete
    };

    viewModel.hasLogo = ko.computed(function () {
        return !_.isEmpty(viewModel.logoUrl());
    });

   

    return viewModel;

    function activate() {
        return modulesInitializer.init().then(function () {
            viewModel.logoUrl(templateSettings.logoUrl ? templateSettings.logoUrl : '');
            if (progressContext.ready()) {

                app.on('progress:error').then(showProgressError);
                var progress = progressContext.get();
                if (_.isObject(progress)) {
                    if (_.isObject(progress.answers)) {
                        _.each(course.sections, function (section) {
                            _.each(section.questions, function (question) {
                                if (!_.isNull(progress.answers[question.shortId]) && !_.isUndefined(progress.answers[question.shortId])) {
                                    question.progress(progress.answers[question.shortId], progress.url);
                                }
                            });
                        });
                    }
                }
            }
            return controller.activate();
        });
    }

    function compositionComplete() {
        background.apply(templateSettings.background);
    }

    function openFinishPopup() {
        viewModel.isFinishPopupVisible(true);
    }
    function closeFinishPopup() {
        viewModel.isFinishPopupVisible(false);
    }
    function close() {
        return eventManager.courseFinalized().then(function () {
            windowOperations.close(function() { viewModel.isClosed(true); });
        });
    }
    function finish() {
        controller.finish();
    }

    function showProgressError() {
        viewModel.progressError(true);
    }
});