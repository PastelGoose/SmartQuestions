import React from 'react';

/* A duplicate of the "QuestionsHistory" in the student view. For displaying information about a students past performance. */

const QuestionsHistory = (props) =>(
  <div>
    <h3>Question History</h3>
      {props.questions.map((question) => (
        <ul key={question.questionId}>
          <li>Question: {question.questionText}</li>
          <li>Answered On: {new Date(question.answerDate).toLocaleString('en-us')}</li>
          <li>Category: {question.categoryName}</li>
          <li>Difficulty: {question.difficulty}</li>
          <li>Your response: {question.answer}</li>
          <li>Grade: {question.grade}</li>
        </ul>
      ))}
  </div>
);

export default QuestionsHistory;
