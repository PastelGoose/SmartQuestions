import React from 'react';

const StudentCompetency = (props) => (
  <div>
    <h3>Inside Student Competency Component</h3>
    {props.competency.map((category) => (
      <ul key={category.categoryId}>
        <li>Category: {category.categoryName}</li>
        <li>Competency Score: {category.competencyScore}</li>
        <li>Improving: {category.isImproving.toString()}</li>
      </ul>
    ))}
  </div>
);

export default StudentCompetency;
