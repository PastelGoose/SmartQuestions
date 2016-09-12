/* top-level render for the teacher view */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/App.jsx';
import StudentsList from './components/StudentsList.jsx';
import StudentReport from './components/StudentReport.jsx';
import QuestionsHistory from './components/QuestionsHistory.jsx';
import Questions from './components/Questions.jsx';
import QuestionsList from './components/QuestionsList.jsx';
import Add from './components/Add.jsx';
import Grade from './components/Grade.jsx';

/*All that's here is the client-side router. See here: https://github.com/reactjs/react-router for info on how it works.*/

render((
  <Router history={hashHistory}>
{/* Eventually you should be using "browserHistory" instead of "hashHistory". See the react-router documentation on "navigation".*/}
    <Route path="/" component={ App }>
      <Route path="/students">
        <IndexRoute component={ StudentsList }/>
        <Route path="/students/:studentId" component={ StudentReport }/>
      {/*Note the paramaterization of the studentId. See react-router documentation on "paramters".*/}
      </Route>
      <Route path="/questions" component={ Questions }>
        <Route path="/questions/view" component={ QuestionsList }/>
        <Route path="/questions/add" component={ Add }/>
        <Route path="/questions/grade" component={ Grade }/>
      </Route>
    </Route>
  </Router>
  ), 
document.getElementById('app')
);