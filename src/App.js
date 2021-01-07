import React from 'react';
import { Route, Switch } from 'react-router-dom';

import RequireAuth from './auth/requireAuth';
import NavBar from './navBar/container';
import RegistrationForm from './auth/registration/registrationForm';
import LoginForm from './auth/login/loginForm';
import PgpTest from './testComp/presentation';
import Home from './home/container';

import Typography from 'material-ui/Typography';

const App = () => {
  return (
    <div>
      {/* <Typography type="display4" color="accent">
        Abstruse
      </Typography> */}
      <NavBar />
      <Switch>
        {/* <Route exact path="/" component={PgpTest} /> */}
        <Route exact path="/" component={RequireAuth(Home)} />
        <Route path="/login" component={LoginForm} />
        <Route path="/register" component={RegistrationForm} />
        <Route path="/aTest" component={PgpTest} />
      </Switch>
    </div>
  );
};

export default App;
