
import React from 'react';
import Question from './Question.jsx';

class Questions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          questionId: 2,
          question: 'what\'s one times seven',
          categories: 'recursion',
          difficulty: 2,
          answered: false,
          order: 2
        },
        {
          questionId: 1,
          question: 'what\'s five times five',
          categories: 'logic',
          difficulty: 5,
          answered: true,
          order: 1
        },
        {
          questionId: 3,
          question: 'what\'s eleven times twelve',
          categories: 'times-tables',
          difficulty: 8,
          answered: false,
          order: 3
        }
      ]
    };

  }

  render() {
    return (
      <div>
        <h2>Questions List Component</h2>
        {
          this.state.data.sort(function(a, b) { return a.order - b.order; }).map(function(question) {
            if (question.answered === false) {
              return (
                <div key={question.order}>
                  <h3>Question Component #{question.order}</h3>
                  <Question question={question} />
                </div>
              );
            }
          })
        }
      </div>
    );
  }

}

export default Questions;
