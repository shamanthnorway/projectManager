import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import App from './components/app';
import Login from './components/login';
import Teams from './components/teams';
import Tasks from './components/tasks';
import newTask from './components/tasks/newtask';
import Task from './components/tasks/task';
import Tickets from './components/tickets';
import Wikis from './components/wikis';
import Users from './components/users';
import Team from './components/team';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/teams/:teamID/tasks/newTask" component={newTask} />
          <Route path="/teams/:teamID/tasks/:taskID" component={Task} />
          <Route path="/teams/:teamID/tasks" component={Tasks} />
          <Route path="/teams/:teamID/tickets" component={Tickets} />
          <Route path="/teams/:teamID/wikis" component={Wikis} />
          <Route path="/teams/:teamID/users" component={Users} />
          <Route path="/teams/:teamID" component={Team} />
          <Route path="/teams" component={Teams} />
          <Route path="/" component={Login} />
        </Switch>        
      </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
