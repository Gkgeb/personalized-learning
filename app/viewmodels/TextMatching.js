define(['./Question'], function (Question) {

    var ctor = function (question) {

        Question.call(this, question);
        var
            that = this,
            values = _.chain(question.answers)
                .map(function (answer) {
                    return answer.value;
                })
                .shuffle()
                .value()
        ;

        that.content = question.content;
        that.targets = ko.observableArray(_.map(values, function (value) {
            return new Target(value);
        }));
        that.sources = ko.observableArray();
        var sources = _.map(question.answers, function (answer) {
            var source = new Source(answer.id, answer.key);
            var target = _.find(that.targets(), function (target) {
                return target.value() == answer.attemptedValue;
            });
            if (target) {
                source.acceptValue(target.value());
                target.rejectValue();
                that.isAnswered(true);
                that.isAnsweredCorrectly(question.score == 100);
            }
            else {
                source.value(null);
            }
            return source;

        });
        that.sources(sources);

        that.isDirty = ko.computed(function () {
            var count = 0;
            _.each(that.targets(), function(blank) {
                if (!blank.value()) {
                    count++;
                }
            });
            return count === question.answers.length;
        });
        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);

            var i = 0, l = question.answers.length;
            for (; i < l; i++) {
                that.sources()[i].rejectValue();
                that.targets()[i].acceptValue(values[i]);
            }
        }

        that.submit = function (preventSendingParentProgress) {
            question.answer(preventSendingParentProgress, _.map(that.sources(), function (source) {
                return { id: source.id, value: ko.unwrap(source.value) };
            }));
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };

    };


    return ctor;

    function Source(id, key) {
        this.id = id;
        this.key = key;
        this.value = ko.observable();

        this.acceptValue = function (value) {
            this.value(value);
        }
        this.rejectValue = function () {
            this.value(null);
        }
    }

    function Target(value) {
        this.value = ko.observable(value);
        this.acceptValue = function (value) {
            this.value(value);
        }
        this.rejectValue = function () {
            this.value(null);
        }
    }
})