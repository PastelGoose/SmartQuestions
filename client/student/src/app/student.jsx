// run "npm run dev" to automatically watch for jsx changes and build accordingly.

import React from 'react';
import {render} from 'react-dom';
import Questions from './Questions.jsx';
import TeacherSelect from './TeacherSelect.jsx';

class StudentApp extends React.Component {
  render () {
    return (
      <div>
        <h1>This is the student view!</h1>
        <hr />
        <TeacherSelect />
        <hr />
        <Questions />
      </div>
    );
  }
}

render(<StudentApp/>, document.getElementById('student-app'));
