import React from 'react';
import { Link } from 'react-router';
import NavLink from './NavLink.jsx'

var Questions = (props) => (
  <div>
    <div className="row nav">
      <div className="col-4">
        <NavLink to="questions/view">View Questions</NavLink>
      </div>
      <div className="col-4">
        <NavLink to="questions/add">Add a Question</NavLink>
      </div>
      <div className="col-4">
        <NavLink to="questions/grade">Grade Questions</NavLink>
      </div>
    </div>
    {props.children}
  </div>
);

export default Questions;