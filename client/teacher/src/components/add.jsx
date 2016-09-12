import React from 'react';
import { Link } from 'react-router';

class Add extends React.Component {

  constructor() {
    super();
    this.state = {category: '', difficulty: '', questionText: '', submitted: 0};
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

    var rootUrl = window.location.origin;

    $.ajax({
      url: rootUrl + '/api/teacher/questions',
      dataType: 'json',
      type: 'POST',
      data: dataObject,
      success: function(response) {
        console.log('POST successful');
        this.setState({
          category: '',
          difficulty: '',
          questionText: '',
          submitted: this.state.submitted + 1
        });
      }.bind(this),
      error: function(xhs, status, err) {
        console.log('error POSTing question,', err);
      }
    });
  };

  render() {

    var submitStatement = (<p></p>)

    if (this.state.submitted !== 0) {
      submitStatement = (<p>{this.state.submitted} questions submitted.</p>)
    };


    return (
      <div className="row">
        <div className="col-4 centered">
          <form onSubmit={ this.handleSubmit.bind(this) } className="add-form">
            <input type="text"
              placeholder="Category" 
              value={ this.state.category }
              onChange={ this.handleCategories.bind(this) }/><br/>
            <input type="number"
              value={ this.state.difficulty } 
              placeholder="Difficulty" 
              onChange={this.handleDifficulty.bind(this) }/><br/>
            <textarea className="question-text-input" 
              type="text" value={this.state.questionText} 
              placeholder="Question Text" 
              onChange={this.handleQuestionText.bind(this)}/><br/>
            <input className="submit-button" type="submit" 
              value="Submit"/>
          </form>
          {submitStatement}
        </div>
      </div>
    );
  }
};

export default Add;