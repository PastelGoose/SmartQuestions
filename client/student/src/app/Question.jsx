import React from 'react';

// Display the current question and trigger POST on submission of response
const Question = (props) => {

  const handleSubmit = () => {
    var ans = document.getElementById('student-response').value;
    // If no response was given, do not submit
    if (ans === '') {
      return;
    }
    // Hard-code userID of 2 for the POST for Demo purposes
    props.postResponse(2, props.question.questionId, ans); 
  };

  return (
    <div>
      <p><h2>Daily Question {props.questionIdx + 1} of {props.totalProblems}</h2></p>
      <div className="text-centered">
        <p><h3>Question: {props.question.questionText}</h3></p>
        <p><textarea className="question-text-input" id="student-response" type="text"/></p>
        <p><button className="submit-button" onClick={ handleSubmit }>Submit</button></p>
      </div>
    </div>
  );

};

export default Question;
