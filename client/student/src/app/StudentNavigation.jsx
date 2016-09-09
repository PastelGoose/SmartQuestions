import React from 'react';

const StudentNavigation = (props) => {

  return (
    <div>
      <h1>Smart Questions - Student</h1>
      <h3>Navigation</h3>
      <ul>
        <li onClick={() => props.setCurrentPage('Questions')}>Daily Questions</li>
        <li onClick={() => props.setCurrentPage('StudentReport')}>My Progress Report</li>
      </ul>
    </div>
  );

};

export default StudentNavigation;
