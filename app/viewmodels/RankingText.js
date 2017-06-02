define(['./Question'], function (Question) {

    var ctor = function (question) {
        Question.call(this, question);
        var that = this;

        that.rankingItems = ko.observableArray(question.rankingItems);

        that.content = question.content;
        
        that.isDirty = ko.observable(false);
        that.markDirty = function() {
            that.isDirty(true);
        }

        that.resetAnswer = function () {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
        }

        that.submit = function (preventSendingParentProgress) {
            question.answer(preventSendingParentProgress, that.rankingItems());

            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };

    };
    
    return ctor;
    
})