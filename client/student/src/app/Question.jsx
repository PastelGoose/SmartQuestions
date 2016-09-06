import React from 'react';

const Question = function(props) {

  return (
    <ul>
      <li>QuestionId: {props.question.questionId}</li>
      <li>Difficulty: {props.question.difficulty}</li>
      <li>Categories: {props.question.categories}</li>
      <li>Answered: {props.question.answered.toString()}</li>
    </ul>
  );

};

export default Question;