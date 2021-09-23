import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingRoute from './components/routes/Landing/Landing';
import LoginRoute from './components/routes/Login/LoginRoute';

export default class CryptApp extends React.PureComponent {
  render(): JSX.Element {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={LandingRoute} />
          <Route path="/login" exact component={LoginRoute} />
        </Switch>
      </Router>
    );
  }
}
