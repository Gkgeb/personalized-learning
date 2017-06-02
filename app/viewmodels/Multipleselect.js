define(['./Question'], function (Question) {

    var ctor = function (question) {

        var that = this;

        Question.call(that, question);

        that.content = question.content;

        that.options = _.chain(question.answers)
            .sample(question.answers.length)
            .map(function (option) {
            if (option.isChecked) {
                that.isAnswered(true);
                that.isAnsweredCorrectly(question.score == 100);
            }
            return {
                    id: option.id,
                    text: option.text,
                    checked: ko.observable(option.isChecked),
                    toggleCheck: function () {
                        if (that.isAnswered()) {
                            return;
                        }
                        this.checked(!this.checked());
                    }
                }
            }).value();
        that.isDirty = ko.computed(function () {
            var count = 0;
            _.each(that.options, function (option) {
                if (option.checked()) {
                    count++;
                }
            });
            return count > 0;
        });
        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
            _.each(that.options, function (option) {
                option.checked(false);
            });
        }

        that.submit = function (preventSendingParentProgress) {
            question.answer(preventSendingParentProgress, _.chain(that.options)
                .filter(function (answer) {
                    return answer.checked();
                })
                .map(function (answer) {
                    return answer.id;
                }).value());

            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };
    };
    return ctor;
})