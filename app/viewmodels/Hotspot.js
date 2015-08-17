﻿define(['./Question'], function (Question) {

    var ctor = function (question) {
        var that = this;
        debugger
        Question.call(that, question);

        that.id = question.id;
        that.title = question.title;
        that.content = question.content;
        that.background = question.background;
        that.isMultiple = question.isMultiple;
        that.submit = function () {
            question.answer(that.marks());
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };
        that.marks = ko.observableArray([]);
        _.each(question.placedMarks, function (mark) {
            that.marks.push(mark);
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score==100);
        });


        that.isDirty = ko.computed(function() {
            if (that.marks().length) {
                return true;
            }
        });
        that.addMark = function (mark) {
            if (!question.isMultiple) {
                that.marks.removeAll();
            }
            that.marks.push(mark);
        }
        that.removeMark = function (mark) {
            that.marks.remove(mark);
        }
        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
            that.marks.removeAll();
        }
    };

    return ctor;
})