import React from 'react';

// Header + Navigation component
const StudentNavigation = (props) => {
  // Add class of active based on the state.currentPage from student.jsx
  return (
    <div>
      <div className="row header">
        <h1 className="title">Smart Questions</h1>
      </div>
      <div className="row nav top-nav">
        <div className='col-6 NavLink-box'>
          <a className={((props.currentPage === 'Questions') ? 'active' : '') } 
            onClick={() => props.setCurrentPage('Questions')}>Daily Questions
          </a>
        </div>
        <div className='col-6 NavLink-box'>
          <a className={((props.currentPage === 'Questions') ? '' : 'active') } 
            onClick={() => props.setCurrentPage('StudentReport')}>My Progress Report
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudentNavigation;
