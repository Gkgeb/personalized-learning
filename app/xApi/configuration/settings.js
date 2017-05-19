define(['../verbs', 'publishSettings'], function (verbs, publishSettings) {
    "use strict";

    var settingsModule = {
        initialize: initialize
    };

    settingsModule.settings = {
        scoresDistribution: {
            positiveVerb: verbs.passed
        },

        actor: {
            name: '',
            email: ''
        },

        anonymousCredentials: {
            username: '',
            password: ''
        },

        xApi: {
            allowedVerbs: [],
            lrs: {
                uri: ''
            }
        },

        timeout: 120000, //2 minutes

        defaultLanguage: "en-US",
        xApiVersion: "1.0.0",
    };

    var host = window.location.host;
    var lrsHost = publishSettings.defaultLRSUrl || 'reports.easygenerator.com';

    var defaultXapi = {
        lrs: {
            uri: '//' + lrsHost + '/xApi/statements',
            authenticationRequired: false,
            credentials: {
                username: '',
                password: ''
            }
        },
        allowedVerbs: ['started', 'stopped', 'mastered', 'answered', 'passed', 'failed', 'progressed']
    };


    return settingsModule;

    function initialize(templateSettings) {
        if (templateSettings.selectedLrs != 'default') {
            $.extend(settingsModule.settings.xApi, templateSettings);
        } else {
            $.extend(settingsModule.settings.xApi, defaultXapi);
        }

        var lrsUrl = settingsModule.settings.xApi.lrs.uri;
        if (lrsUrl.indexOf("/statements") == -1) {
            settingsModule.settings.xApi.lrs.uri = lrsUrl + "/statements";
        }

    }

});