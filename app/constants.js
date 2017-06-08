define(function () {
    'use strict';

    return {
        questionTypes: {
            multipleSelect: 'multipleSelect',
            fillInTheBlank: 'fillInTheBlank',
            dragAndDrop: 'dragAndDropText',
            singleSelectText: 'singleSelectText',
            singleSelectImage: 'singleSelectImage',
            textMatching: 'textMatching',
            hotspot: 'hotspot',
            statement: 'statement',
            scenario: 'scenario',
            rankingText: 'rankingText'
        },
        course: {
            statuses: {
                completed: 'completed',
                failed: 'failed',
                inProgress: 'inProgress'
            }
        },
        localStorageResultKey: 'course_result',
        localStorageProgressKey: 'course_progress',
        views: {
            introduction: 'introduction/viewmodels/index',
            preassessment: 'preassessment/viewmodels/index',
            studyAdvice: 'studyAdvice/viewmodels/index',
            overallProgress: 'overallProgress/viewmodels/index',
            question:'question'
        },

        patterns: {
            email: /^[^@\s]+@[^@\s]+$/,
            isoDuration: /^PT[0-9]{1,2}H[0-9]{1,2}M[0-9]{1,2}S$/
        },
        
        documents: {
            types: {
                pdf: 'pdf',
                word: 'word',
                exel: 'exel',
                powerpoint: 'powerpoint',
                zip: 'zip'
            },
            downloadLocalizationKey: '[download]',
            containerSelector: '.document-container',
            sizeAttrName: 'data-document-size-kb',
            typeAttrName: 'data-document-type',
            downloadBtnSelector: '.download-document-btn'
        }
    };

});