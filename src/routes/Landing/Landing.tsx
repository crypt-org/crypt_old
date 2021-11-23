import React from "react";
import { RouteComponentProps } from "react-router-dom";

export default class LandingRoute extends React.PureComponent<RouteComponentProps<any>> {

  constructor(props: RouteComponentProps<any>) {
    super(props);

    // 'this' bindings
    this.goToLogin = this.goToLogin.bind(this);
  }

  goToLogin() {
    this.props.history.push('/login');
  }

  render(): JSX.Element {
    return (
      <div>
        <h1>Welcome to CryptApp</h1>
        <div>
          <button onClick={this.goToLogin}>login</button>
        </div>
      </div>
    );
  }
}