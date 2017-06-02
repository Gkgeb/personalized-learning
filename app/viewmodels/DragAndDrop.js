define(['./Question'], function (Question) {

    var ctor = function (question) {
        var that = this;

        Question.call(that, question);

        that.content = question.content;

        that.background = question.background;
        that.dropspots = _.map(question.dropspots, function (dropspot) {
            if (dropspot.placed) {
                var obj = _.find(question.dropspots, function(spot) {
                    return dropspot.placed.id == spot.id;
                });
                that.isAnswered(true);
                that.isAnsweredCorrectly(question.score == 100);
                return {
                    x: dropspot.x,
                    y: dropspot.y,
                    text: ko.observable(obj.text)
                }

            } else {
                return {
                    x: dropspot.x,
                    y: dropspot.y,
                    text: ko.observable()
                }
            }
        });
        that.texts = _.map(question.dropspots, function (dropspot) {
            return {
                id: dropspot.id,
                text: dropspot.text
            };
        });
        that.isDirty = ko.computed(function () {
            var count = 0;
            _.each(that.dropspots, function(dropspot) {
                if (dropspot.text()) {
                    count++;
                }
            });
            return count === question.dropspots.length;
        });


        that.submit = function (preventSendingParentProgress) {
            var answer = [];

            _.each(that.dropspots, function (dropspot) {
                var text = dropspot.text();
                if (text) {
                    answer.push({
                        id: text.id,
                        x: dropspot.x,
                        y: dropspot.y
                    });
                }

            });

            question.answer(preventSendingParentProgress, answer);

            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score === 100);
        };

        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
            _.each(that.dropspots, function (dropspot) {
                dropspot.text(undefined);
            });
        }

    };

    return ctor;
})