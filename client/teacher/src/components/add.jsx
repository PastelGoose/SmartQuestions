import React from 'react';

class Add extends React.Component {

  constructor() {
    super();
    this.state= {category: '', difficulty: 0, questionText: ''};
  }

  handleCategories(event) {
    this.setState({ category: event.target.value });
  }

  handleDifficulty(event) {
    this.setState({ difficulty: event.target.value });
  }

  handleQuestionText(event) {
    this.setState({ questionText: event.target.value });
  }



  handleSubmit(event) {
    event.preventDefault();
    var category = this.state.category;
    var difficulty = this.state.difficulty;
    var questionText = this.state.questionText;
    if (!category || !questionText || isNaN(difficulty)) {
      return;
    }
    var dataObject = {
      uid: 1,
      questions: [
        { question: questionText,
          category: category,
          difficulty: difficulty
        }
      ]
    }

    var rootUrl = process.env.ROOT_URL || 'http://192.168.1.65:4568';

    $.ajax({
      url: rootUrl + '/api/teacher/question',
      dataType: 'json',
      type: 'POST',
      data: dataObject,
      success: function(response) {
        console.log('POST successful');
      },
      error: function(xhs, status, err) {
        console.log('error POSTing,', err);
      }
    });
  };

  render() {
    return (
      <div className="add-form-container">
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <input type="text"   
            placeholder="Category" 
            value={ this.state.category }
            onChange={ this.handleCategories.bind(this) }/><br/>
          <input type="number" 
            value = { this.state.difficulty } 
            placeholder="Difficulty" 
            onChange={this.handleDifficulty.bind(this) }/><br/>
          <input className="question-text-input" 
            type="text" value={this.state.questionText} 
            placeholder="Question Text" 
            onChange={this.handleQuestionText.bind(this)}/><br/>
          <input type="submit" 
            value="Submit"/>
        </form>
      </div>
    );
  }
};

export default Add;