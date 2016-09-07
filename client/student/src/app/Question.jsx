import React from 'react';

const Question = function(props) {

  return (
    <div>
      <h2>Question {props.question.order} of {props.totalProblems}</h2>
      <ul>
        <li>Question: {props.question.question}</li>
        <li>id: {props.question.id}</li>
        <li>Difficulty: {props.question.difficulty}</li>
        <li>Categories: {props.question.CategoryId}</li>
        <li>Answered: {props.question.answered.toString()}</li>
      </ul>
      <p><textarea id="student-response" type="text" cols="50" rows="5" /></p>
      <p><button onClick={ () => { 
        //console.log(props.postResponse);
        var ans = document.getElementById('student-response').value;
        // If no response was given, do not submit
        if (ans === '') {
          return;
        }
        props.postResponse(2, props.question.id, ans); 
      }}>Submit Answer</button></p>
    </div>
  );

};

export default Question;