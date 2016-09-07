import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/app.jsx';
import Questions from './components/questions.jsx';
import Students from './components/students.jsx';
import Add from './components/add.jsx';

render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }/>
    <Route path="/questions" component={ Questions }/>
    <Route path="/students" component={ Students }/>
    <Route path="/questions/add" component={ Add }/>
  </Router>
  ), 
document.getElementById('app')
);