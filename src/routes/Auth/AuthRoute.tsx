import "./AuthRoute.scss";
import React from "react";
import { isMobileView } from "../../styles";
import {
  AuthMode,
  Durations,
  TransitionState,
} from "./constants";
import InfoSection from "./components/info";
import AuthSection from "./components/auth";

export type AuthPageProps = {};
export type AuthPageState = {
  authMode: AuthMode;
  transitionState: TransitionState;
  isMobileView: boolean;
  authSectionModeChangeCallback?: () => void;
  infoSectionModeChangeCallback?: () => void;
};

export default class AuthRoute extends React.PureComponent<
  AuthPageProps,
  AuthPageState
> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      authMode: AuthMode.SIGN_IN,
      transitionState: TransitionState.FIXED,
      isMobileView: isMobileView(),
      authSectionModeChangeCallback: undefined,
      infoSectionModeChangeCallback: undefined,
    };
    this.changeAuthMode = this.changeAuthMode.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () =>
      this.setState({ isMobileView: isMobileView() })
    );
  }

  componentWillUnmount() {
    window.addEventListener("resize", () =>
      this.setState({ isMobileView: isMobileView() })
    );
  }

  changeAuthMode(): void {
    const nextMode: AuthMode =
      this.state.authMode === AuthMode.SIGN_IN
        ? AuthMode.SIGN_UP
        : AuthMode.SIGN_IN;

    // Initiate Mode Change
    this.setState({
      authMode: nextMode,
      transitionState: TransitionState.TRANSITIONING,
    });

    // Delayed Content Change
    setTimeout(() => {
      this.state.infoSectionModeChangeCallback &&
        this.state.infoSectionModeChangeCallback();
      this.state.authSectionModeChangeCallback &&
        this.state.authSectionModeChangeCallback();
    }, Durations.MODE_CHANGE_MS / 2);

    // Stop Transitions
    setTimeout(() => {
      this.setState({ transitionState: TransitionState.FIXED });
    }, Durations.MODE_CHANGE_MS);
  }

  resetTransitionState(): void {
    this.setState({ transitionState: TransitionState.FIXED });
  }

  render(): JSX.Element {
    return (
      <div className="authPageDiv">
        <InfoSection
          isMobileView={this.state.isMobileView}
          authMode={this.state.authMode}
          transitionState={this.state.transitionState}
          changeAuthMode={this.changeAuthMode}
          setModeChangeCallback={(callback: () => void) => {
            this.setState({ infoSectionModeChangeCallback: callback });
          }}
        />

        <AuthSection
          isMobileView={this.state.isMobileView}
          transitionState={this.state.transitionState}
          authMode={this.state.authMode}
          setModeChangeCallback={(callback: () => void) =>
            this.setState({ authSectionModeChangeCallback: callback })
          }
        />
      </div>
    );
  }
}
