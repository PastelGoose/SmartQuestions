// run "npm run dev" to automatically watch for jsx changes and build accordingly.

import React from 'react';
import {render} from 'react-dom';
import Navigation from './StudentNavigation.jsx';
import Questions from './Questions.jsx';
import StudentReport from './StudentReport.jsx';

class StudentApp extends React.Component {
  constructor() {
    super();
    // The state is used to determine which component to render
    this.state = {currentPage: 'Questions'};
  }

  // Helper function to set the current page view.  Passed
  // down as props.
  setCurrentPage(newPage) {
    this.setState({currentPage: newPage});
  }

  render () {
    // Depending on the state, render different views
    if (this.state.currentPage === 'Questions') {
      return (
        <div className="grid">
          <Navigation 
            setCurrentPage={this.setCurrentPage.bind(this)} 
            currentPage={this.state.currentPage} 
          />
          <Questions />
        </div>
      );
    } else if (this.state.currentPage === 'StudentReport') {
      return (
        <div className="grid">
          <Navigation 
            setCurrentPage={this.setCurrentPage.bind(this)} 
          />
          <StudentReport />
        </div>
      );
    }
  }
  
}

render(<StudentApp/>, document.getElementById('student-app'));
