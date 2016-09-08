import React from 'react';

class TeacherSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherList: [],
      currentTeacher: 'YOU HAVE NO TEACHER YET =('
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
    //var endpoint = 'http://192.168.1.65:4568/api/student/teachers';
    // $.ajax({
    //   method: 'GET',
    //   url: endpoint,
    //   data: {uid: 2},
    //   success: function(results) {
    //     console.log('success');
    //     console.log(results);
    //     this.setState(results);

    //   },
    //   error: function(err) {
    //     console.log('error');
    //     console.log(err);
    //   }
    // });

    // Dummy Data
    var data = [
      {
        name: 'stephen notwong',
        id: 1
      },
      {
        name: 'damien mccool',
        id: 2
      }
    ];

    this.setState({teacherList: data});
  }

  componentDidMount() {
    this.getTeachersList();
  }

  setTeacher() {
    var teacherId = document.getElementById('selected-teacher').value;
    console.log('setTeacher invoked.  teacherId is: ', teacherId);
    // //sample post data:  {"studentId":1,"teacherId":2}
    // Perform an ajax call to POST teacher.
    //var endpoint = 'http://192.168.1.65:4568/api/student/teachers';
    // $.ajax({
    //   method: 'POST',
    //   url: endpoint,
    //   // student and teacher uid should be sent?
    //   data: {studentId: 2, teacherId: teacherId},
    //   success: function(results) {
    //     console.log('success');
    //     console.log(results);
    //     this.setState(results);

    //   },
    //   error: function(err) {
    //     console.log('error');
    //     console.log(err);
    //   }
    // });

  }

  render() {

    return (
      <div>
        <h2>This is the Settings component</h2>
        <h3>Your current teacher is: {this.state.currentTeacher}</h3>
        <h3>Teachers: 
          <select id="selected-teacher" defaultValue="default">
            <option value="default">Select New Teacher</option>
            {
              this.state.teacherList.map( (teacher) => {
                return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>;
              })
            }
          </select>
          <button onClick={this.setTeacher}>Set Teacher</button>
        </h3>
      </div>

    );
  }
}


export default TeacherSelect;
