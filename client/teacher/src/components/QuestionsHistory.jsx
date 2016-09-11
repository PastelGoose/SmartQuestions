import React from 'react';

const QuestionsHistory = (props) =>(
  <div>
    <h3>Inside QuestionsHistory Component</h3>
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
