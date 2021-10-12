import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
// import {} from 'styled-components/cssprop';
import LandingRoute from './components/routes/Landing/Landing';
import LoginRoute from './components/routes/Login/LoginRoute';
import FirebaseApp from './services/Firebase/Firebase';

export default class CryptApp extends React.PureComponent {
  render(): JSX.Element {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/auth" />
          </Route>
          <Route path="/auth" exact component={LoginRoute} />
        </Switch>
      </Router>
    );
  }
}
