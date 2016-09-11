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
        this.setState({students: response.data})
        console.log('Students GETted')
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

    var students = this.state.students;

    if (students === undefined) {
      return (<p>Loading...</p>);
    }

    if (students.length === 0) {
      return (<p>No students in the database.</p>);
    }

    else {

      var studentNodes = students.map((student, i) => (
          <StudentItem data={student} key={i}/>
        ));

      return (
        <div className="row">
          <div className="col-4 centered">
            <h2> Your Students </h2>
            <ul> {studentNodes} </ul>
          </div>
        </div>
      );
    }
  }

}

export default StudentsList;