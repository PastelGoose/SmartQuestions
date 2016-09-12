import React from 'react';

// Show the history of previously graded questions
const QuestionsHistory = (props) => {

  return (
    <div className="centered">
      <h3>Your Question History</h3>
      {props.questions.map(function(question) {
        return (
          <ul key={question.questionId}>
            <li>Question: {question.questionText}</li>
            <li>Answered On: {new Date(question.answerDate).toLocaleString('en-us')}</li>
            <li>Category: {question.categoryName}</li>
            <li>Difficulty: {question.difficulty}</li>
            <li>Your response: {question.answer}</li>
            <li>Grade: {question.grade}</li>
          </ul>
        );
      })}
    </div>
  );

};

export default QuestionsHistory;
