import React from 'react';
import QuestionsHistory from './QuestionsHistory.jsx';
import StudentCompetency from './StudentCompetency.jsx';

class StudentReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      studentId: null,
      name: null,
      questionsAnswered: [],
      competency: []
    };
  }


  getReport() {
    //Sample shape of GET response for student report
    var sampleGetResponse = {
      'data': {
        'studentId': 2,
        'name': 'damien mccool',
        'questionsAnswered': [
          {
            'questionId': 3,
            'questionText': 'why do cats cross the street',
            'difficulty': 10,
            'categoryName': 'recursion',
            'answer': 'x is the multiple',
            'grade': 1,
            'answerDate': 123
          },
          {
            'questionId': 1,
            'questionText': 'what is the x kdjf',
            'difficulty': 10,
            'categoryName': 'recursion',
            'answer': 'x is the multiple',
            'grade': 1,
            'answerDate': 456
          },
          {
            'questionId': 2,
            'questionText': 'y times kdjf',
            'difficulty': 1,
            'categoryName': 'logic',
            'answer': 'x is the multiple',
            'grade': 1,
            'answerDate': 789
          }
        ],
        'competency': [
          {
            'categoryId': 1,
            'categoryName': 'recursion',
            'competencyScore': 4,
            'isImproving': true
          },
          {
            'categoryId': 2,
            'categoryName': 'logic',
            'competencyScore': 1,
            'isImproving': false
          }
        ]
      }
    };

    this.setState({
      studentId: sampleGetResponse.data.studentId,
      name: sampleGetResponse.data.name,
      questionsAnswered: sampleGetResponse.data.questionsAnswered,
      competency: sampleGetResponse.data.competency
    });
    
    console.log('report state: ', this.state);
  }

  // Get the report immediately on component load
  componentDidMount() {
    this.getReport();
  }



  render() {

    return (
      <div>
        <h2>This is the Student Report component</h2>
        <p>studentId: {this.state.studentId}</p>
        <p>name: {this.state.name}</p>

        <StudentCompetency competency={this.state.competency} />
        <QuestionsHistory questions={this.state.questionsAnswered} />
      </div>

    );
  }




}

export default StudentReport;

