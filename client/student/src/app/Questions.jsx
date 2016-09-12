
import React from 'react';
import Question from './Question.jsx';
import TeacherSelect from './TeacherSelect.jsx';

class Questions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherFound: false, 
      data: []
    };
  }

  setTeacherFoundToTrue() {
    this.setState({teacherFound: true});
    // Now that the teacher has been selected, get the list of daily questions
    this.getQuestions();
  }

  getQuestions() {
    //console.log('getQuestions triggered');
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/questions';
    $.ajax({
      method: 'GET',
      url: endpoint,
      data: {uid: 2},
      success: function(results) {
        console.log('success');
        console.log(results);
        // Should sort the result set by order before inserting into setState.

        // If results is 'No teacher found', do not display questions.  The user needs to set a teacher first
        if (results !== 'No teacher found') {
          this.setState({
            teacherFound: true, 
            data: results.data.sort(function(a, b) { return a.order - b.order; })
          });
        }

      }.bind(this),
      error: function(err) {
        console.log('error');
        console.log(err);
      }
    });

    // Dummy data without ajax
    // this.setState({
    //   data: [
    //     {
    //       questionId: 2,
    //       question: 'what\'s one times seven',
    //       categories: 'recursion',
    //       difficulty: 2,
    //       answered: false,
    //       order: 2
    //     },
    //     {
    //       questionId: 1,
    //       question: 'what\'s five times five',
    //       categories: 'logic',
    //       difficulty: 5,
    //       answered: false,
    //       order: 1
    //     },
    //     {
    //       questionId: 3,
    //       question: 'what\'s eleven times twelve',
    //       categories: 'times-tables',
    //       difficulty: 8,
    //       answered: false,
    //       order: 3
    //     }
    //   ]
    // });
  }

  componentDidMount() {
    this.getQuestions();
  }

  postResponse(uid, qid, ans) {
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/questions';
    
    $.ajax({
      method: 'POST',
      url: endpoint,
      data: {uid: uid, questionId: qid, answer: ans},
      success: function(results) {
        console.log('success');
        console.log(results);
      },
      error: function(err) {
        console.log('error');
        console.log(err);
      }
    });

    // Note: Client post data should be in this form
    // "{
    //  uid: 343,
    //  questionid: 2,
    //  answer: “x is the multiple..”
    //  }"
    // console.log('Question submitted!');
    // console.log('uid: ', uid);
    // console.log('qid: ', qid);
    // console.log('ans: ', ans);
    
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
    // This area has logic that sorts the questions by order, then displays the first problem that has
    // not yet been answered.  It only displays one problem at a time per render.  Once all the questions
    // have been answered, display "completed all questions".
    var problemFound = false;
    var problemsComplete = 0;
    var totalProblems = this.state.data.length;
    
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
    } else if (this.state.data.length === 0) {
      return (
        <div className="row">
          <div className="col-4 centered">
            <h2>Questions List Component</h2>
            <h3>You've completed all the problems for the day!</h3>
          </div>
        </div>
      );
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
                //   do not display another.
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
                  // If we make it here, it means we are still looking for the first unanswered question
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
