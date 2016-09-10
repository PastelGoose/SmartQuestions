// run "npm run dev" to automatically watch for jsx changes and build accordingly.

import React from 'react';
import {render} from 'react-dom';
import Questions from './Questions.jsx';
import StudentReport from './StudentReport.jsx';
import Navigation from './StudentNavigation.jsx';

class StudentApp extends React.Component {
  constructor() {
    super();
    this.state = {currentPage: 'Questions'};
  }

  setCurrentPage(newPage) {
    this.setState({currentPage: newPage});
  }

  render () {

    if (this.state.currentPage === 'Questions') {
      return (
        <div>
          <Navigation setCurrentPage={this.setCurrentPage.bind(this)} />
          <Questions />
        </div>
      );
    } else if (this.state.currentPage === 'StudentReport') {
      return (
        <div>
          <Navigation setCurrentPage={this.setCurrentPage.bind(this)} />
          <StudentReport />
        </div>
      );
    }
  }
  
}

render(<StudentApp/>, document.getElementById('student-app'));
