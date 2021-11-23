import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import AuthRoute from './routes/Auth/AuthRoute';
import SetupRoute from './routes/Setup/SetupRoute';

export default class CryptApp extends React.PureComponent {
  render(): JSX.Element {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/auth" />
          </Route>
          <Route path="/auth" exact component={AuthRoute} />
          <Route path="/setup" exact component={SetupRoute} />
        </Switch>
      </Router>
    );
  }
}
