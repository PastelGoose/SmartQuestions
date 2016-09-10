import React from 'react';
import { Link } from 'react-router';

class Grade extends React.Component {
  
  constructor() {
    super();
    this.state = {questions: undefined, currentIndex: 0, grade: undefined};
  }

  getToGrade() {
    var rootUrl = window.location.origin;
    $.ajax({
      url: rootUrl + '/api/teacher/grading',
      type: 'GET',
      options: {uid: 1},
      success: function(response) {

        this.setState({questions: response.data})
      }.bind(this),
      error: function(xhs, status, err) {
        console.log('error GETting questions to grade, ', err);
      }
    });
  }

  componentDidMount() {
    this.getToGrade();
  }

  handleSelect(event) {
    console.log('in handleSelect');
    console.log(event.target.value);
    this.setState({grade: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.grade) {
      return;
    }

    var graded = this.state.questions[this.state.currentIndex];

    var dataObject = {
      teacherId: 1,
      studentId: graded.studentId,
      questionId: graded.questionId,
      grade: this.state.grade * 1
    }
    console.log(dataObject);

    var rootUrl = window.location.origin;
    
    $.ajax({
      url: rootUrl + '/api/teacher/grading',
      dataType: 'json',
      type: 'POST',
      data: dataObject,
      success: function(response) {
        console.log('POST successful');
        this.setState({currentIndex: this.state.currentIndex + 1});
      }.bind(this),
      error: function(xhs, status, err) {
        console.log('error posting grade, ', err);
      }
    });

  }

  render() {
    if (this.state.questions === undefined) {
      return (<p>Loading...</p>)
    }

    var toGrade = this.state.questions[this.state.currentIndex];
    if (!toGrade) {
      return (
        <p>No questions to grade.</p>
      );
    }
    else {
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
              checked={this.state.grade === '4'}
              onChange={this.handleSelect.bind(this)}/> 
            Complete
            <input type="radio" 
              value="3" 
              checked={this.state.grade === '3'}
              onChange={this.handleSelect.bind(this)}/> 
            Mostly Compelte
            <input type="radio" 
              value="2" 
              checked={this.state.grade === '2'}
              onChange={this.handleSelect.bind(this)}/> 
            Significant Progress
            <input type="radio" 
              value="1" 
              checked={this.state.grade === '1'}
              onChange={this.handleSelect.bind(this)}/> 
            Attempted 
            <input type="radio" 
              value="0" 
              checked={this.state.grade === '0'}
              onChange={this.handleSelect.bind(this)}/> 
            Words with Beth
            <input type="submit" value="Submit"/>
          </form>
          <Link to="/questions">Back to Questions</Link><br/> <Link to="/">Back to Home</Link>
        </div> 
      );
    }
  }

};

export default Grade;