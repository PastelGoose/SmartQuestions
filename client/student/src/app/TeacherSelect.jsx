import React from 'react';

// This is rendered when the student has not selected a teacher yet.
class TeacherSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherList: [],
    };
  }

  getTeachersList() {
   
    // Perform an ajax call to GET list of teachers
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/teachers';
    $.ajax({
      method: 'GET',
      url: endpoint,
      data: {uid: 2},
      success: function(results) {
        this.setState({teacherList: results.data});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });

  }

  componentDidMount() {
    this.getTeachersList();
  }

  // Perform an ajax call to POST the selected teacher.
  setTeacher() {
    var teacherId = document.getElementById('selected-teacher').value;
    if (teacherId === 'default') {
      return;
    }
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/teachers';
    $.ajax({
      method: 'POST',
      url: endpoint,
      data: {studentId: 2, teacherId: teacherId},
      success: function(results) {
        this.props.setTeacherFoundToTrue();
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });

  }

  render() {

    return (
      <div className="row">
        <div className="col-4 centered">
          <h2>Please select your teacher.</h2>
          <h3>Teachers: 
            <select id="selected-teacher" defaultValue="default">
              <option value="default">Select New Teacher</option>
              {
                this.state.teacherList.map( (teacher) => {
                  return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>;
                })
              }
            </select>
            <button onClick={this.setTeacher.bind(this)}>Set Teacher</button>
          </h3>
        </div>
      </div>

    );
  }
}

export default TeacherSelect;
