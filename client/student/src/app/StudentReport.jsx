import React from 'react';
import QuestionsHistory from './QuestionsHistory.jsx';
import StudentCompetency from './StudentCompetency.jsx';

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
    //Sample shape of GET response for student report
    // var results = {
    //   'data': {
    //     'studentId': 2,
    //     'name': 'damien mccool',
    //     'questionsAnswered': [
    //       {
    //         'questionId': 3,
    //         'questionText': 'why do cats cross the street',
    //         'difficulty': 10,
    //         'categoryName': 'recursion',
    //         'answer': 'x is the multiple',
    //         'grade': 1,
    //         'answerDate': 123
    //       },
    //       {
    //         'questionId': 1,
    //         'questionText': 'what is the x kdjf',
    //         'difficulty': 10,
    //         'categoryName': 'recursion',
    //         'answer': 'x is the multiple',
    //         'grade': 1,
    //         'answerDate': 456
    //       },
    //       {
    //         'questionId': 2,
    //         'questionText': 'y times kdjf',
    //         'difficulty': 1,
    //         'categoryName': 'logic',
    //         'answer': 'x is the multiple',
    //         'grade': 1,
    //         'answerDate': 789
    //       }
    //     ],
    //     'competency': [
    //       {
    //         'categoryId': 1,
    //         'categoryName': 'recursion',
    //         'competencyScore': 4,
    //         'isImproving': true
    //       },
    //       {
    //         'categoryId': 2,
    //         'categoryName': 'logic',
    //         'competencyScore': 1,
    //         'isImproving': false
    //       }
    //     ]
    //   }
    // };
    var rootUrl = window.location.origin;
    var endpoint = rootUrl + '/api/student/report';
    $.ajax({
      method: 'GET',
      url: endpoint,
      data: {uid: 2},
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
        console.log('error');
        console.log(err);
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
