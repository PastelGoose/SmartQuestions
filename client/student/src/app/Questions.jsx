
import React from 'react';
import Question from './Question.jsx';
import TeacherSelect from './TeacherSelect.jsx';

// Display the questions of the day to the student to respond to
class Questions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherFound: false, 
      data: []
    };
  }
  // Called after the student selects a teacher for the first time. Gets
  // the questions of the day afterwards.
  setTeacherFoundToTrue() {
    this.setState({teacherFound: true});
    // Now that the teacher has been selected, get the list of daily questions
    this.getQuestions();
  }

  getQuestions() {
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/questions';
    $.ajax({
      method: 'GET',
      url: endpoint,
      // Hard-code studentID of 2 for Demo purposes
      data: {uid: 2},
      success: function(results) {
        // If results is 'No teacher found', do not display questions.  The user needs to set a teacher first
        if (results !== 'No teacher found') {
          this.setState({
            teacherFound: true, 
            data: results.data.sort(function(a, b) { return a.order - b.order; })
          });
        }

      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });

  }

  componentDidMount() {
    this.getQuestions();
  }

  // Send the student response to the question to the server
  postResponse(uid, qid, ans) {
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/questions';
    
    $.ajax({
      method: 'POST',
      url: endpoint,
      data: {uid: uid, questionId: qid, answer: ans},
      success: function(results) {
      },
      error: function(err) {
        console.log(err);
      }
    });
    
    // After successful post, update the question on the state (answered: true)
    // Slice used here so we don't modify the state directly without setState.
    var tempStateData = this.state.data.slice();
    tempStateData.forEach(function(question) {
      if (question.questionId === qid) {
        question.answered = true;
      }
    });
    // Then set the new state with one more question answered.
    this.setState({data: tempStateData});
  }

  render() {
    // This area has logic that displays the first problem that has
    // not yet been answered.  It only displays one problem at a time 
    // per render.  Once all the questions have been answered, display 
    // "completed all questions".

    var problemFound = false;
    var problemsComplete = 0;
    var totalProblems = this.state.data.length;
    // If no teacher has been selected yet, display the TeacherSelect component
    if (!this.state.teacherFound) {
      return (
        <div className="row">
          <div className="col-4 centered">
            <h2>Questions List Component</h2>
            <h2>You must select a teacher before you are able to view questions.</h2>
            <TeacherSelect setTeacherFoundToTrue={this.setTeacherFoundToTrue.bind(this)}/>
          </div>
        </div>
      );
      // If there are no more questions queued for the day, show "completed"
    } else if (this.state.data.length === 0) {
      return (
        <div className="row">
          <div className="col-4 centered">
            <h2>Questions List Component</h2>
            <h3>You've completed all the problems for the day!</h3>
          </div>
        </div>
      );
      // Else, render the questions to do, one at a time
    } else {
      return (
        <div className="row">
          <div className="col-4 centered">
            { 
              // Find the first unanswered question
              this.state.data.map(function(question) {
                // Keep track of how many questions we've answered so far
                if (question.answered === true) {
                  problemsComplete++;
                }
                // If the current problem has not yet been answered, show it to the student.
                // If the first unanswered question has already been found in this map loop,
                // do not display another.
                if ((question.answered === false) && (problemFound === false)) {
                  problemFound = true;
                  return (
                    <div key={problemsComplete}>
                      <Question 
                        question={question}
                        questionIdx={problemsComplete} 
                        totalProblems={totalProblems}
                        postResponse={this.postResponse.bind(this)}
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
                  // If we make it here, it means the "question" is not a valid candidate to be displayed;
                  // i.e. the first problem to display was already found
                } else {
                  return;
                }
              }.bind(this))
            }
          </div>
        </div>
      ); 
    }
  }
}

export default Questions;
