import React from 'react';
import { browserHistory } from 'react-router';

class StudentItem extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick(event) {
    const path = `/students/${props.data.studentId}`;
    browserHistory.push(path);
  }

  render(props) {
    return (
      <li onClick={this.handleClick.bind(this)}>
        <ul>
          <li>ID: {props.data.studentId}</li>
          <li>Name: {props.data.studentName}</li>
        </ul>
      </li>
    );
  }
}

export default StudentItem;