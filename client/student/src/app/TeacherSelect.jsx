import React from 'react';

class TeacherSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherList: [],
    };
  }

  getTeachersList() {
    // sample GET response
    // "{
    //   ""data"": [
    //     {
    //       ""name"": ""stephen notwong"",
    //       ""id"": 1
    //     },
    //     {
    //       ""name"": ""damien mccool"",
    //       ""id"": 2
    //     }
    //   ]
    // }"

    // Perform an ajax call to GET list of teachers
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/teachers';
    $.ajax({
      method: 'GET',
      url: endpoint,
      data: {uid: 2},
      success: function(results) {
        console.log('successfully got list of teachers');
        console.log(results);
        this.setState({teacherList: results.data});

      }.bind(this),
      error: function(err) {
        console.log('error');
        console.log(err);
      }
    });

    // Dummy Data
    // var data = [
    //   {
    //     name: 'stephen notwong',
    //     id: 1
    //   },
    //   {
    //     name: 'damien mccool',
    //     id: 2
    //   }
    // ];

    // this.setState({teacherList: data});
  }

  componentDidMount() {
    this.getTeachersList();
  }

  setTeacher() {
    var teacherId = document.getElementById('selected-teacher').value;
    if (teacherId === 'default') {
      return;
    }
    console.log('setTeacher invoked.  teacherId is: ', teacherId);
    // //sample post data:  {"studentId":1,"teacherId":2}
    // Perform an ajax call to POST teacher.
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/teachers';
    $.ajax({
      method: 'POST',
      url: endpoint,
      // student and teacher uid should be sent?
      data: {studentId: 2, teacherId: teacherId},
      success: function(results) {
        console.log('success');
        console.log(results);
        console.log('props in TeacherSelect is', this.props);
        this.props.setTeacherFoundToTrue();
      }.bind(this),
      error: function(err) {
        console.log('error');
        console.log(err);
      }
    });

  }

  render() {

    return (
      <div>
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

    );
  }
}

export default TeacherSelect;
