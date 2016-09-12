import React from 'react';
import { Link } from 'react-router';
import NavLink from './NavLink.jsx'

var Questions = (props) => (
  <div>
    <div className="row lower-nav nav question-nav-container">
      <div className="col-4">
        <Link className="lower" to="questions/view" activeClassName="active-lower">View Questions</Link>
      </div>
      <div className="col-4">
        <Link className="lower" to="questions/add" activeClassName="active-lower">Add a Question</Link>
      </div>
      <div className="col-4">
        <Link className="lower" to="questions/grade" activeClassName="active-lower">Grade Questions</Link>
      </div>
    </div>
    {props.children}
  </div>
);

export default Questions;