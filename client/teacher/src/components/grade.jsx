import React from 'react';
import { Link } from 'react-router';

class Grade extends React.Component {
  
  constructor() {
    super();
    this.state = {questions: [], currentIndex: 0, grade: 'peanut'};
    this.getToGrade();
  }

  getToGrade() {
    var rootUrl ='http://192.168.1.65:4568';
    $.ajax({
      url: rootUrl + '/api/teacher/grading',
      type: 'GET',
      headers: {uid: 1},
      success: function(response) {
        this.setState({questions: response.data})
      },
      error: function(xhs, status, err) {
        console.log('error GETting questions to grade, ', err);
      }
    });
  }

  handleSelect(event) {
    this.setState({grade: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    if (isNaN(this.grade)) {
      return;
    }

    var dataObject = {}
  }

  render() {
    var toGrade = this.state.questions[this.state.currentIndex];
    return (
     
      <div className="toGrade-container">
        <ul>
          <li>Difficulty: {toGrade.difficulty}</li>
          <li>Category: {toGrade.category}</li>
          <li><h3>Question:</h3><br/> {toGrade.questionText}</li>
          <li><h3>Answer:</h3><br/> {toGrade.answer}</li>
        </ul>
        <form onSubmit= {this.handleSubmit.bind(this)}>
          <input type="radio" 
            value="4" 
            checked={this.state.grade === 4}
            onChange={this.handleSelect.bind(this)}> Complete
          </input>
          <input type="radio" 
            value="3" 
            checked={this.state.grade === 3}
            onChange={this.handleSelect.bind(this)}> Mostly Compelte
          </input>
          <input type="radio" 
            value="2" 
            checked={this.state.grade === 2}
            onChange={this.handleSelect.bind(this)}> Significant Progress
          </input>
          <input type="radio" 
            value="1" 
            checked={this.state.grade === 1}
            onChange={this.handleSelect.bind(this)}> Attempted 
          </input>
          <input type="radio" 
            value="0" 
            checked={this.state.grade === 0}
            onChange={this.handleSelect.bind(this)}> Words with Beth
          </input>
          <input type="submit" value="Submit"/>
        </form>
        <Link to="/questions">Back to Questions</Link> <Link to="/">Back to Home</Link>
      </div> 
    );
  }

};

export default Grade;