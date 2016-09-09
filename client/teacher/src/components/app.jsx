import React from 'react';
import NavLink from './NavLink.jsx';

var App = (props) => (
  <div className="grid">
    <div className="row header">
      <h1>Smart Questions</h1>
    </div>
      <ul className="nav">
        <li><NavLink to="/questions">Questions</NavLink></li>
        <li><NavLink to="/students">Students</NavLink></li>
      </ul>
  {props.children}
  </div>
);

export default App;

