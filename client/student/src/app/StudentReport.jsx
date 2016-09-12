import React from 'react';
import QuestionsHistory from './QuestionsHistory.jsx';
import StudentCompetency from './StudentCompetency.jsx';


// This component is to show the student's Individual Progress Report
class StudentReport extends React.Component {

  constructor() {
    super();
    this.state = {
      studentId: null,
      name: null,
      questionsAnswered: [],
      competency: []
    };
  }

  // Perform the ajax call to get the student's individual report.
  getReport() {
    
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/report';
    $.ajax({
      method: 'GET',
      url: endpoint,
      // Hardcode student ID of 2 for demo purposes
      data: {uid: 2},
      success: function(results) {
        this.setState({
          studentId: results.data.studentId,
          name: results.data.name,
          questionsAnswered: results.data.questionsAnswered,
          competency: results.data.competency
        });

      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });

  }

  // Get the report immediately on component load
  componentDidMount() {
    this.getReport();
  }

  render() {

    return (
      <div className="row">
        <div className="col-6 centered">
          <h2>{this.state.name + "'s Individual Report"}</h2>
          <StudentCompetency competency={this.state.competency} />
          <QuestionsHistory questions={this.state.questionsAnswered} />
        </div>
      </div>

    );
  }
  

}

export default StudentReport;
