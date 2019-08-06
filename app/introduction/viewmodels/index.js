define(['entities/course', 'plugins/http', 'durandal/app'], function (course, http, app) {
    "use strict";

    var viewModel = {
        activate: activate,
        start: start
    };

    return viewModel;

    function activate() {
        viewModel.introduction = course.introduction;
    }

    function start() {
        app.trigger('introduction:completed');
    }

});