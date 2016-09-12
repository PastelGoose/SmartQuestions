import React from 'react';
import { hashHistory } from 'react-router';

/* Single student item, for use in iteratory in "StudentList". */

class StudentItem extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick(event) {
    const path = `/students/${this.props.data.studentId}`;
    hashHistory.push(path);
  }

  /* Programatically navigates, on click, to StudentReport component */

  render() {
    return (
      <li onClick={this.handleClick.bind(this)} className="student-item">
        <ul>
          <li>ID: {this.props.data.studentId}</li>
          <li>Name: {this.props.data.studentName}</li>
        </ul>
      </li>
    );
  }
}

export default StudentItem;