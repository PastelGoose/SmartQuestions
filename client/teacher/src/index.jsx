import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/App.jsx';
import StudentsList from './components/StudentsList.jsx';
import StudentReport from './components/StudentReport.jsx';
import Questions from './components/Questions.jsx';
import QuestionsList from './components/QuestionsList.jsx';
import Add from './components/Add.jsx';
import Grade from './components/Grade.jsx';

render((
  <Router history={hashHistory}>
    <Route path="/" component={ App }>
      <Route path="/students" component= { StudentsList }>
        <Route path="/students/:studentId" component={ StudentReport }/>
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