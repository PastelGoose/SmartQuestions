import React from 'react';

const StudentNavigation = (props) => {

  return (
    <div>
      <h1>Smart Questions - Student</h1>
      <h3>Navigation</h3>
      <ul>
        <li><a onClick={() => props.setCurrentPage('Questions')}>Daily Questions</a></li>
        <li><a onClick={() => props.setCurrentPage('StudentReport')}>My Progress Report</a></li>
      </ul>
    </div>
  );

};

export default StudentNavigation;
