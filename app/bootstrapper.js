define(function (require) {
    "use strict";

    return {
        run: run
    };

    function run() {
        if ("ontouchstart" in document.documentElement) {
            $('html').addClass('touch');
        }

        var system = require('durandal/system');
        system.defer = function (action) {
            var deferred = Q.defer();
            action.call(deferred, deferred);
            var promise = deferred.promise;
            deferred.promise = function () {
                return promise;
            };
            return deferred;
        };


        var http = require('plugins/http');
        http.get = function (url, query) {
            return Q($.ajax(url, { data: query }));
        };

        http.post = function (url, data) {
            return Q($.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            }));
        };

        var binder = require('durandal/binder');
        binder.binding = function (obj, view) {
            require('localization').localize(view);
        };
        binder.bindingComplete = (function () {

            var handlers = {};

            var f = function (data, view) {
                var key = $(view).attr('data-view');

                if (key && handlers[key]) {
                    _.each(handlers[key], function (handler) {
                        require('durandal/composition').current.complete(function () {
                            _.defer(function () {
                                handler.apply(null, [view]);
                            }, 10);
                        });
                    });
                }
            }

            f.addHandler = function (key, handler) {
                if (!_.isArray(handlers[key])) {
                    handlers[key] = [];
                }

                handlers[key].push(handler);
            }

            return f;

        })();
        binder.bindingComplete.addHandler('views/TextMatching', require('views/helpers/TextMatching'));

        require('_components/bindingHandlers/backgroundBindingHandler').install();
        require('_components/bindingHandlers/wrapElementsBindingHandler').install()
        require('_components/bindingHandlers/overlayBindingHandler').install();
        require('_components/bindingHandlers/progressbarBindingHandler').install();
        require('_components/bindingHandlers/readystatechangeBindingHandler').install();
        require('_components/bindingHandlers/scrollElementBindingHandler').install();
        require('_components/bindingHandlers/thumbnailBindingHandler').install();
        require('_components/bindingHandlers/toggleVisibleBindingHandler').install();
        require('_components/bindingHandlers/questionProgressBindingHandler').install();
        require('_components/bindingHandlers/circleProgressBindingHandler').install();
        require('_components/bindingHandlers/learningContentBindingHandler').install();
        require('_components/bindingHandlers/dropDownBindingHandler').install();
        require('_components/bindingHandlers/customFocusBindingHandler').install();
        
        require('viewmodels/bindingHandlers/DragAndDrop').install();
        require('viewmodels/bindingHandlers/Hotspot').install();
        require('viewmodels/bindingHandlers/FillInTheBlanks').install();
        require('viewmodels/bindingHandlers/TextMatching').install();
    }

}); 
