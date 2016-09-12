import React from 'react';
import {core as Core} from 'zingchart-react';

// Shows the student's competency per category
class StudentCompetency extends React.Component {

  constructor(props) {
    super(props);
  }

  loadRadarChart() {
    // Best viewed with at least 3 categories
    var categories = [];
    var scores = [];
    // The radar chart expects the data to be in arrays.  Push categories and scores accordingly.
    // Competency categories and scores comes from the parent, StudentReport.
    this.props.competency.forEach((category) => {
      categories.push(category.categoryName);
      scores.push(category.competencyScore);
    });

    // To be passed into the zingchart render function as 'data'
    var competencyChart = {
      type: 'radar',
      plot: {
        aspect: 'area'
      },
      'scale-k': {
        labels: categories
      },
      series: [{values: scores}]
    };

    // Renders the chart to the target id
    zingchart.render({
      id: 'competency-chart',
      width: 'auto',
      height: 'auto',
      data: competencyChart
    });
  }

  render() {
    // Call the helper function on render
    this.loadRadarChart();

    return (
      <div>
        <div id="competency-chart"></div>
      </div>

    );
    
  }
}
    
export default StudentCompetency;
