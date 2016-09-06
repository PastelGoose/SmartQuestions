import React from 'react';

const Question = function(props) {

  return (
    <div>
      <h2>Question {props.question.order} of {props.totalProblems}</h2>
      <ul>
        <li>Question: {props.question.question}</li>
        <li>QuestionId: {props.question.questionId}</li>
        <li>Difficulty: {props.question.difficulty}</li>
        <li>Categories: {props.question.categories}</li>
        <li>Answered: {props.question.answered.toString()}</li>
      </ul>
      <p><textarea type="text" cols="50" rows="5" /></p>
      <p><button>Submit Answer</button></p>
    </div>
  );

};

export default Question;