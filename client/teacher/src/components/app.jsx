import React from 'react';
import NavLink from './NavLink.jsx';

var App = (props) => (
  <div className="grid">
    <div className="row header">
      <h1 className="title">Smart Questions</h1>
    </div>
    <div className="row nav top-nav">
      <div className="col-6 NavLink-box">
        <NavLink to="/questions">Questions</NavLink>
      </div>
      <div className="col-6 NavLink-box">
        <NavLink to="/students">Students</NavLink>
      </div>
    </div>
    
    {props.children}
    
    <div className="row footer">
    </div>
  </div>
);

export default App;

