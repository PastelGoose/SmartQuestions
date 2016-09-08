import React from 'react';
import { Link } from 'react-router';

var App = (props) => (
  <div className="grid">
    <div className="row header">
      <h1>Smart Questions</h1>
    </div>
      <ul className="nav">
        <li><Link to="/questions">Questions</Link></li>
        <li><Link to="/students">Students</Link></li>
      </ul>
  {props.children}
  </div>
);

export default App;

