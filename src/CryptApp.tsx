import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import AuthRoute from './components/routes/Login/AuthRoute';
import FirebaseApp from './services/Firebase/Firebase';

export default class CryptApp extends React.PureComponent {
  render(): JSX.Element {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/auth" />
          </Route>
          <Route path="/auth" exact component={AuthRoute} />
        </Switch>
      </Router>
    );
  }
}
