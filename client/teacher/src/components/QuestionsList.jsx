import React from 'react';
import QuestionItem from './QuestionItem.jsx';

/* For displaying all questions that a teacher has entered into the database */

class QuestionsList extends React.Component {

  constructor() {
    super();
    this.state = {questions: undefined};
  }

  getQuestions() {

    var rootUrl = window.location.origin;

    $.ajax({
      url: rootUrl + '/api/teacher/questions',
      type: 'GET',
      options: {uid: 1},
      success: function(response) {
        this.setState({questions: response.data})
        console.log('Questions GETted')
      }.bind(this),
      error: function(xhs, status, err) {
        console.log('error GETting questions to view ', err);
      }
    });
  }

  componentDidMount() {
    this.getQuestions();
  }

  render() {

    var questions = this.state.questions;
    console.log(questions);

    if (questions === undefined) {
      return (<p>Loading...</p>);
    }

    if (questions.length === 0) {
      return (<p>No questions in the database.</p>);
    }

    else {

      var questionNodes = questions.map((question, i) => (
          <QuestionItem data={question} key={i}/>
        ));

      return (
        <div className="row">
          <div className="col-4 centered">
            <h2> Your Questions </h2>
            <ul className="question-list"> {questionNodes} </ul>
          </div>
        </div>
      );
    }

  }

}

export default QuestionsList;