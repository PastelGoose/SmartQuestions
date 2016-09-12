import React from 'react';

const Question = (props) => {

  const handleSubmit = () => {
    var ans = document.getElementById('student-response').value;
    // If no response was given, do not submit
    if (ans === '') {
      return;
    }
    props.postResponse(2, props.question.questionId, ans); 

  };

  return (
    <div>
      <ul>
        <li><h2>Daily Question {props.questionIdx + 1} of {props.totalProblems}</h2></li>
        <li><h3>Question: {props.question.questionText}</h3></li>
        <li><textarea id="student-response" type="text" cols="50" rows="5" /></li>
        <li><button onClick={ handleSubmit }>Submit Answer</button></li>
      </ul>
    </div>
  );

};

export default Question;
