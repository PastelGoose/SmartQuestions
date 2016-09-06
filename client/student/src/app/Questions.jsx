
import React from 'react';
import Question from './Question.jsx';

class Questions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          questionId: 1,
          categories: 'recursion',
          difficulty: 10,
          answered: false,
          order: 1
        },
        {
          questionId: 2,
          categories: 'logic',
          difficulty: 10,
          answered: false,
          order: 2
        }
      ]
    };

  }

  render() {
    return (
      <div>
        <h2>Questions List Component</h2>
        {
          this.state.data.map(function(question) {
            return (
              <div key={question.order}>
                <h3>Question Component #{question.order}</h3>
                <Question question={question} />
              </div>
            );
          })
        }
      </div>
    );
  }

}

export default Questions;


