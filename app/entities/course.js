define(['eventManager', 'Q', 'constants'], function (eventManager, Q, constants) {
    "use strict";

    var course = {
        score: score,
        finish: finish,
        close: close,
        isCompleted: false,
        isFinished: false,
        isSuccessful: isSuccessful,
        getStatus: getStatus,
        introduction: [],
        sections: [],
        title: '',
        id: '',
        createdOn: undefined
    };

    return course;

    function score() {
        var totalPercents = _.reduce(course.sections, function (memo, section) {
            return memo + section.score();
        }, 0);
        return Math.ceil(totalPercents / course.sections.length);
    }

    function finish() {
        course.isFinished = true;
        course.isCompleted = course.isSuccessful();
        course.result = course.score() / 100;
        
        return eventManager.courseFinished(course);
    }

    function close() {
        return eventManager.courseFinalized().then(function () {
            eventManager.turnAllEventsOff();
        });
    }

    function getStatus() {
        if (!course.isFinished) {
            return constants.course.statuses.inProgress;
        }
        
        return course.isCompleted ? constants.course.statuses.completed : constants.course.statuses.failed;
    }

    function isSuccessful() {
        return !_.some(course.sections, function (section) {
            return !section.isCompleted();
        });
    }
});