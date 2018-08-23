(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'changes are saved': 'All changes are saved',
        'changes are not saved': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',
        'settings are not initialize': 'Template settings are not initialized. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',

        //results tracking tab
        'results tracking': 'Results Tracking',
        
        'lrs': 'LRS',
        'webhooks': 'Webhooks',
        
        'chooseLrsLabel': 'Choose LRS <span>(Learning Record Store <a href="https://help.easygenerator.com/results-tracking/results-tracking-via-lrs" targen="_blank">Learn more</a>)</span>',
        'default': 'easygenerator (recommended)',
        'custom': 'Custom LRS',

        'addWebhookEndpoinLabel': 'Add a webhook endpoint: <a href="https://help.easygenerator.com/additional-features/webhooks" target="_blank">Learn more</a>',
        'webhookUrlLabel': 'URL to be called',
        'urlCheckButtonText': 'Check URL',
        'checkErrorMessage': 'An error appears',
        'checkSuccessMessage': 'URL successfully reached',

        'track and trace settings': 'Track and trace settings',
        'results tracking option': 'Results tracking:',
        'results tracking hint': '(will not affect tracking and tracing in SCORM/LMS)',
        'allow user to skip option': 'Allow user to skip tracking and tracing:',
        'disabled': 'Disabled',
        'enabled': 'Enabled',
        'allow': 'Allow',
        'forbid': 'Forbid',
        'advanced settings': 'Advanced settings',
        'report to': 'Report to:',
        'custom lrs settings': 'Custom LRS settings',
        'lrs url': 'LRS URL',
        'authentication required': 'Authentication required',
        'lap login': 'LAP login',
        'lap password': 'LAP password',
        'use statements': 'Use statements:',
        'started': 'Started',
        'stopped': 'Stopped',
        'passed': 'Passed',
        'answered': 'Answered',
        'mastered': 'Mastered',
        'failed': 'Failed',
        'progressed': 'Progressed',

        //template language
        'template language': 'Template language',

        'xx': 'Custom',

        'choose language for your course': 'Choose language for your course',
        'defaultText': 'Default',
        'translation': 'Translation'
    };

})(window.app = window.app || {});
