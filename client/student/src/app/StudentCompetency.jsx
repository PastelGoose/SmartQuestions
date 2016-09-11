import React from 'react';
import {core as Core} from 'zingchart-react';

class StudentCompetency extends React.Component {

  constructor(props) {
    super(props);
  }

  loadRadarChart() {
    // Best viewed with at least 3 categories
    var categories = [];
    var scores = [];
    this.props.competency.forEach((category) => {
      categories.push(category.categoryName);
      scores.push(category.competencyScore);
    });

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

    zingchart.render({
      id: 'competency-chart',
      width: 600,
      height: 400,
      data: competencyChart
    });
  }

  render() {

    this.loadRadarChart();

    return (
      <div>
        <div id="competency-chart"></div>
      </div>

    );
    
  }
}
    
export default StudentCompetency;
