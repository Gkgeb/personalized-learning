define(['./Question'], function (Question) {

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
        };

        that.options = _.chain(question.answers)
            .sample(question.answers.length)
            .map(function (option) {
                var obj = {
                    id: option.id,
                    image: option.image
                };
                if (option.isChecked) {
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

        that.submit = function (preventSendingParentProgress) {
            question.answer(preventSendingParentProgress, [that.selectedOption() ? that.selectedOption().id : undefined]);
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };
    };

    return ctor;
})