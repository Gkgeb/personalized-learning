define(['knockout', '_', 'durandal/app', 'viewmodels/Question'], function (ko, _, app, Question) {

    var ctor = function (question) {
        var that = this,
            branchTrackInstance = Branchtrack.create(question.projectId);
        
        Question.call(that, question);
        
        that.content = question.content;
        that.embedCode = ko.observable(question.embedCode);
        that.customSubmitButton = 'viewmodels/scenarioquestion/submitQuestion';
        that.customSumbitData = {
            branchtrackInstance: branchTrackInstance
        };
        
        that.customFeedbackView = 'scenarioquestion/feedback.html';

        that.isDirty = ko.computed(function () {
            if (that.projectId) {
                return true;
            }
        });

        that.submit = function (preventSendingParentProgress) {
            question.answer(preventSendingParentProgress, branchTrackInstance.score);
            that.isAnswered(true);
            that.isAnsweredCorrectly(question.score == 100);
        };

        that.resetAnswer = function() {
            that.isAnswered(false);
            that.isAnsweredCorrectly(false);
            that.embedCode.valueHasMutated();
            branchTrackInstance.reset();
        };
        app.on('studying:stop-reading', destroyBranchtrackInstance);
        app.on('preassessment:completed', destroyBranchtrackInstance);
        
        function destroyBranchtrackInstance() {
            if(!_.isNull(branchTrackInstance) || !_.isUndefined(branchTrackInstance)){
                branchTrackInstance.destroy();
            }
        }
    };

    return ctor;
})