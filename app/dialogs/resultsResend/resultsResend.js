define(['knockout', 'translation', '_', 'entities/course', 'constants'],
function(ko, translation, _, course, constants) {

    var _skipSendinResultsText = localizeText(constants.dialogs.resendResults.skipSendingResultsKey);

    var viewModel = {
        resend: {},
        onResendingSkip: {},
        closeCourse: {},
        retryCount: 0,
        resultsSendErrorTitleText: '',
        skipSendinResultsText: '',

        isCompositionComplete: ko.observable(false),
        isResendingResults: ko.observable(false),
        resendingFailed: ko.observable(false),
        retriesExceeded: ko.observable(false),

        activate: activate,
        compositionComplete: compositionComplete,
        resendResults: resendResults,
        closeCourseWithoutResultsSending: closeCourseWithoutResultsSending,
        skipResending: skipResending,
        hideDialog: hideDialog
    };
   
    return viewModel;

    function activate(data) {
        throwIfNotDefined(data.callbacks, 'callbacks');
        throwIfNotDefined(data.callbacks.resend, 'callbacks.resend');
        throwIfNotDefined(data.callbacks.onResendingSkip, 'callbacks.onResendingSkip');
        throwIfNotDefined(data.callbacks.closeCourse, 'callbacks.closeCourse');
        throwIfNotDefined(data.close, 'close');

        throwIfNotDefined(data.resultsSendErrorTitleKey, 'resultsSendErrorTitleKey');
        throwIfNotDefined(data.endpointNameKey, 'endpointNameKey');

        viewModel.resultsSendErrorTitleText = localizeText(data.resultsSendErrorTitleKey);
        viewModel.skipSendinResultsText = _skipSendinResultsText.replace(constants.dialogs.resendResults.endpointNameReplaceKey, localizeText(data.endpointNameKey));

        viewModel.resend = data.callbacks.resend;
        viewModel.onResendingSkip = data.callbacks.onResendingSkip;
        viewModel.closeCourse = data.callbacks.closeCourse;
        viewModel.close = data.close;

        viewModel.retryCount = data.retryCount || 10;
    }

    function compositionComplete() {
        viewModel.isCompositionComplete(true);
    }
    
    function resendResults() {
        viewModel.isResendingResults(true);

        viewModel.resend(course)
            .then(function() {
                hideDialog();
            })
            .catch(function() {
                viewModel.retryCount ? viewModel.retryCount-- : viewModel.retriesExceeded(true);
                
                viewModel.isResendingResults(false);
                animateNotes();
            });
    }

    function closeCourseWithoutResultsSending() {
        hideDialog();
        viewModel.closeCourse();
    }

    function skipResending() {
        hideDialog();
        viewModel.onResendingSkip();
    }

    function hideDialog() {
        viewModel.isResendingResults(false);
        viewModel.close();
    }

    function localizeText(key) {
        return translation.getTextByKey(key);
    }

    function throwIfNotDefined(parameter, parameterName) {
        if(_.isNull(parameter) || _.isUndefined(parameter)) {
            throw 'Can\'t activate dialog. Parameter isn\'t defined. Parameter name: ' + parameterName;
        }
    }

    function animateNotes() {
        viewModel.resendingFailed(true);
        setTimeout(function() {
            viewModel.resendingFailed(false);
        }, 400);
    }
});