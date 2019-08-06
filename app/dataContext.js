define([
  "entities/ContentBlock",
  "entities/course",
  "entities/Section",
  "entities/Multipleselect",
  "entities/FillInTheBlanks",
  "entities/DragAndDrop",
  "entities/Singleselect",
  "entities/SingleselectImage",
  "entities/TextMatching",
  "entities/Statement",
  "entities/Hotspot",
  "entities/ScenarioQuestion",
  "entities/RankingText",
  "constants",

  "Q",
  "_",
  "plugins/http",
  "publishSettings"
], function(
  ContentBlock,
  course,
  Section,
  Multipleselect,
  FillInTheBlanks,
  DragAndDrop,
  Singleselect,
  SingleselectImage,
  TextMatching,
  Statement,
  Hotspot,
  ScenarioQuestion,
  RankingText,
  constants,
  Q,
  _,
  http,
  publishSettings
) {
  "use strict";

  return {
    initialize: initialize
  };

  function initialize() {
    var dfd = Q.defer();

    $.ajax({
      url: "content/data.js",
      contentType: "application/json",
      dataType: "json",
      cache: false
    }).done(function(response) {
      var promises = [];

      var questionShortIds = publishSettings.questionShortIds || {};

      course.id = response.id;
      (course.templateId = response.templateId),
        (course.title = response.title);
      course.createdOn = new Date(response.createdOn);

      _.each(response.sections, function(dobj) {
        var section = new Section(dobj.id, dobj.title);

        _.each(dobj.questions, function(dq) {
          var spec = {
            id: dq.id,
            shortId: questionShortIds[dq.id],
            title: dq.title,
            type: dq.type
          };
          var question;

          switch (dq.type) {
            case constants.questionTypes.multipleSelect:
              question = new Multipleselect(spec, dq.isSurvey, dq.answers);
              break;
            case constants.questionTypes.fillInTheBlank:
              var answers = [];
              _.each(dq.answerGroups, function(group) {
                _.each(group.answers, function(answer) {
                  if (answer.isCorrect) {
                    answers.push({
                      id: answer.id,
                      groupId: group.id,
                      text: answer.text,
                      matchCase: answer.matchCase
                    });
                  }
                });
              });
              question = new FillInTheBlanks(spec, answers);
              if (dq.hasContent) {
                promises.push(
                  http
                    .get("content/" + dobj.id + "/" + dq.id + "/content.html", {
                      dataType: "html"
                    })
                    .then(function(content) {
                      question.content = content;
                    })
                );
              }
              break;
            case constants.questionTypes.dragAndDrop:
              question = new DragAndDrop(spec, dq.background, dq.dropspots);
              break;
            case constants.questionTypes.singleSelectText:
              question = new Singleselect(spec, dq.isSurvey, dq.answers);
              break;
            case constants.questionTypes.singleSelectImage:
              question = new SingleselectImage(
                spec,
                dq.answers,
                dq.correctAnswerId
              );
              break;
            case constants.questionTypes.textMatching:
              question = new TextMatching(spec, dq.answers, dq.correctAnswerId);
              break;
            case constants.questionTypes.statement:
              question = new Statement(spec, dq.isSurvey, dq.answers);
              break;
            case constants.questionTypes.hotspot:
              question = new Hotspot(
                spec,
                dq.isMultiple,
                dq.background,
                dq.spots
              );
              break;
            case constants.questionTypes.scenario:
              question = new ScenarioQuestion(
                spec,
                dq.projectId,
                dq.embedCode,
                dq.masteryScore
              );
              break;
            case constants.questionTypes.rankingText:
              question = new RankingText(spec, dq.answers);
              break;
            default:
              return undefined;
          }

          if (dq.hasCorrectFeedback) {
            question.correctFeedback =
              "content/" + dobj.id + "/" + dq.id + "/correctFeedback.html";
          }

          if (dq.hasIncorrectFeedback) {
            question.incorrectFeedback =
              "content/" + dobj.id + "/" + dq.id + "/incorrectFeedback.html";
          }

          question.learningContents = _.map(dq.learningContents, function(
            item
          ) {
            return mapContentBlock(item, dobj.id, dq.id);
          });

          question.questionInstructions = _.map(
            dq.questionInstructions,
            function(item) {
              return mapContentBlock(item, dobj.id, dq.id);
            }
          );

          section.questions.push(question);
        });

        if (section.questions && section.questions.length) {
          course.sections.push(section);
        }
      });

      if (response.hasIntroductionContent) {
        if (response.introductions) {
          response.introductions.forEach(function(item, index) {
            course.introduction = response.introductions;

            if(item.children && item.children.length) {
              item.children.forEach(function(child, childIndex){
                promises.push(
                  http
                    .get("content/introduction/" + child.id + ".html", {
                      dataType: "html"
                    })
                    .then(function(response) {
                      course.introduction[index].children[childIndex].content = response;
                    })
                );
              })
            }
            return promises.push(
              http
                .get("content/introduction/" + item.id + ".html", {
                  dataType: "html"
                })
                .then(function(response) {
                  course.introduction[index].content = response;
                })
            );
          });
        }
      }

      Q.allSettled(promises)
        .then(function() {
          dfd.resolve();
        })
        ["catch"](function(reason) {
          dfd.reject(reason);
        });
    });

    return dfd.promise;
  }

  function mapContentBlock(item, dobjId, dqId) {
    var contentUrl = "content/" + dobjId + "/" + dqId + "/" + item.id + ".html";
    var children = _.map(item.children, function(childItem) {
      return mapContentBlock(childItem, dobjId, dqId);
    });

    return new ContentBlock(item.id, contentUrl, children);
  }
});
