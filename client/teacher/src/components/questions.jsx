import React from 'react';
import { Link } from 'react-router';

var Questions = () => (
  <div>
    <div className="question-list-container">
    Questions
    </div>
    <Link to="questions/add">Add a Question</Link><br/>
    <Link to="questions/grade">Grade Questions</Link>
  </div>
);

export default Questions;