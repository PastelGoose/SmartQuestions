import React from 'react';

const QuestionsHistory = (props) => {
  // props.questions has this shape:
  // [
  //   {
  //     'questionId': 3,
  //     'questionText': 'why do cats cross the street',
  //     'difficulty': 10,
  //     'categoryName': 'recursion',
  //     'answer': 'x is the multiple',
  //     'grade': 1,
  //     'answerDate': 123
  //   },
  //   {
  //     'questionId': 1,
  //     'questionText': 'what is the x kdjf',
  //     'difficulty': 10,
  //     'categoryName': 'recursion',
  //     'answer': 'x is the multiple',
  //     'grade': 1,
  //     'answerDate': 456
  //   },
  //   {
  //     'questionId': 2,
  //     'questionText': 'y times kdjf',
  //     'difficulty': 1,
  //     'categoryName': 'logic',
  //     'answer': 'x is the multiple',
  //     'grade': 1,
  //     'answerDate': 789
  //   }
  // ]
  return (
    <div>
    <h3>Inside QuestionsHistory Component</h3>
      {console.log(props.questions)}
    </div>
  );

};

export default QuestionsHistory;
