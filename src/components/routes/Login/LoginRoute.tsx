import React from "react";
import { RouteComponentProps } from "react-router-dom";

export default class LoginRoute extends React.PureComponent<RouteComponentProps<any>> {
  render(): JSX.Element {
    return (
      <div>
        <p>Welcome to Login</p>
        <div>
          <form>
            <input name="username" type="text" placeholder="username"></input>
            <input name="password" type="password" placeholder="password"></input>
            <button type="submit">Login</button>
          </form>
        </div>
        
      </div>
    );
  }
}