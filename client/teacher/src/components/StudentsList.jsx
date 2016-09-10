import React from 'react';
import StudentItem from './StudentItem.jsx';

class StudentsList extends React.Component {

  constructor() {
    super();
    this.state = {students: undefined};
  }

  getStudents() {

    var rootUrl = window.location.origin;

    $.ajax({
      url: rootUrl + '/api/teacher/students',
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
    this.getStudents();
  }

  render() {

    var questions = this.state.questions;

    if (questions === undefined) {
      return (<p>Loading...</p>);
    }

    if (questions.length === 0) {
      return (<p>No questions in the database.</p>);
    }

    else {

      var studentNodes = students.map((student) => (
          <StudentItem data={student}/>
        ));

      return (
        <div className="student-list">
          <ul> {studentNodes} </ul>
        </div>
      );
    }
  }

}

export default StudentsList;