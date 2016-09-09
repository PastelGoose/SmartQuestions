import React from 'react';
import { Link } from 'react-router';
import NavLink from './NavLink.jsx'

var Questions = (props) => (
  <div>
      <ul>
        <li><NavLink to="questions/view">View Questions</NavLink></li>
        <li><NavLink to="questions/add">Add a Question</NavLink></li>
        <li><NavLink to="questions/grade">Grade Questions</NavLink></li>
      </ul>
      {props.children}
  </div>
);

export default Questions;