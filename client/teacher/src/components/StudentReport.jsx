import React from 'react';
import QuestionsHistory from './QuestionsHistory.jsx';
import StudentCompetency from './StudentCompetency.jsx';

/* Top level component for viewing a given student's report. This is close to a duplicate of the StudentReport component
in the student view, though it has been altered to use url parameters. */

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

  getReport() {
    var rootUrl = window.location.origin;
    $.ajax({
      method: 'GET',
      url: rootUrl + '/api/student/report',
      data: this.props.params.studentId,
      /*paramter gets used here. It's availabel because of router magic.*/
      success: function(results) {
        console.log('success');
        console.log(results);
        this.setState({
          studentId: results.data.studentId,
          name: results.data.name,
          questionsAnswered: results.data.questionsAnswered,
          competency: results.data.competency
        });

      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });

    
    console.log('report state: ', this.state);
  }

  // Get the report immediately on component load
  componentDidMount() {
    this.getReport();
  }

  render() {

    return (
      <div className="row">
        <div className="col-4 centered white-frame">
          <h2>{this.state.name + "'s Individual Report"}</h2>
          <StudentCompetency competency={this.state.competency} />
          <QuestionsHistory questions={this.state.questionsAnswered} />
        </div>
      </div>
    );
  }

}

export default StudentReport;
