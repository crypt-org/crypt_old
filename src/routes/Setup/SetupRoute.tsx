import React from "react";
import "./SetupRoute.scss";


export default class SetupRoute extends React.PureComponent {
  render(): JSX.Element {
    return (
      <div className="setupContainer">
        <div className="passwordSetupContainer">
          <p>
            Create your password
          </p>
        </div>
      </div>
    );
  }
}