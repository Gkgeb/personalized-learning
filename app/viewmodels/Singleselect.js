﻿define(['./Question'], function (Question) {

    var ctor = function (question) {
        var that = this;

        Question.call(that, question);
        that.content = question.content;
        that.selectedOption = ko.observable();
        that.isDirty = ko.computed(function () {
            return !!that.selectedOption();
        });
        that.selectOption = function (option) {
            if (that.isAnswered()) {
                return;
            }
            that.selectedOption(option);
            var currentOption = _.find(question.answers, function(answer) {
                return answer.id == option.id;
            });
            currentOption.isChecked = true;
        };
        that.options = _.chain(question.answers)
            .sample(question.answers.length)
            .map(function (option) {
                var obj = {
                    id: option.id,
                    text: option.text,
                    isChecked: option.isChecked
                }
                if (option.isChecked == true) {
                    that.selectedOption(obj);
                    that.isAnswered(true);
                    that.isAnsweredCorrectly(question.score == 100);
                }
                return obj;

            }).value();

        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
            that.selectedOption(undefined);
        }

        that.submit = function () {
            question.answer([that.selectedOption() ? that.selectedOption().id : undefined]);
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };
        _.each(that.options, function (option) {
            if (option.isChecked == true) {
                that.selectedOption(option);
                that.isAnswered(true);
                that.isAnsweredCorrectly(question.score == 100);
            }
        });
    };

    return ctor;
})