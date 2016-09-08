import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/app.jsx';
import Students from './components/students.jsx';
import Questions from './components/questions.jsx';
import Add from './components/add.jsx';
import Grade from './components/grade.jsx';

render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <Route path="/students" component={ Students }/>
      <Route path="/questions" component={ Questions }/>
    </Route>
    <Route path="/questions/add" component={ Add }/>
    <Route path="/questions/grade" component={ Grade }/>
  </Router>
  ), 
document.getElementById('app')
);