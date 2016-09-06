
import React from 'react';
import Question from './Question.jsx';

class Questions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          questionId: 2,
          question: 'what\'s one times seven',
          categories: 'recursion',
          difficulty: 2,
          answered: false,
          order: 2
        },
        {
          questionId: 1,
          question: 'what\'s five times five',
          categories: 'logic',
          difficulty: 5,
          answered: false,
          order: 1
        },
        {
          questionId: 3,
          question: 'what\'s eleven times twelve',
          categories: 'times-tables',
          difficulty: 8,
          answered: false,
          order: 3
        }
      ]
    };

  }

  render() {
    // This area has logic that sorts the questions by order, then displays the first problem that has
    // not yet been answered.  It only displays one problem at a time per render.  Once all the questions
    // have been answered, display "completed all questions".
    var problemFound = false;
    var problemsComplete = 0;
    var totalProblems = this.state.data.length;

    return (
      <div>
        <h2>Questions List Component</h2>
        { // Order the data and find the first unanswered question
          this.state.data.sort(function(a, b) { return a.order - b.order; }).map(function(question) {
            // Keep track of how many questions we've answered so far
            if (question.answered === true) {
              problemsComplete++;
            }
            // If the current problem has not yet been answered, show it to the student.
            // If the first unanswered question has already been found in this map loop,
            //   do not display another.
            if ((question.answered === false) && (problemFound === false)) {
              problemFound = true;
              return (
                <div key={question.order}>
                  <h3>Question Component #{question.order}</h3>
                  <Question 
                    question={question} 
                    totalProblems={totalProblems}
                  />
                </div>
              );
              // If we make it here and this is true, that means the user answered all questions.
            } else if (problemsComplete === totalProblems) {
              return (
                <div key={question.order}>
                  <h3>You've completed all the problems for the day!</h3>
                </div>
              );
              // If we make it here, it means we are still looking for the first unanswered question
            } else {
              return;
            }
          })
        }
      </div>
    );
  }

}

export default Questions;
