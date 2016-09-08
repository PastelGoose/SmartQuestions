import React from 'react';

const StudentCompetency = (props) => {
  // props.competency has this shape:
  // [
  //   {
  //     'categoryId': 1,
  //     'categoryName': 'recursion',
  //     'competencyScore': 4,
  //     'isImproving': true
  //   },
  //   {
  //     'categoryId': 2,
  //     'categoryName': 'logic',
  //     'competencyScore': 1,
  //     'isImproving': false
  //   }
  // ]
  return (
    <div>
    <h3>Inside Student Competency Component</h3>
      <ul>
        <li>Test Competency</li>
      </ul>
    </div>
  );

};

export default StudentCompetency;
