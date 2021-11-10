import React from "react";
import { motion } from "framer-motion";
import {
  AuthMode,
  Durations,
  TransitionState,
  AuthButton,
  CTAQuestion,
} from "../../constants";

export type InfoSectionProps = {
  isMobileView: boolean;
  authMode: AuthMode;
  transitionState: TransitionState;
  setModeChangeCallback: (callback: () => void) => void;
  changeAuthMode: () => void;
};
export type InfoSectionState = {
  ctaQuestionText: string;
  ctaButtonText: string;
};

export default class InfoSection extends React.PureComponent<
  InfoSectionProps,
  InfoSectionState
> {
  constructor(props: InfoSectionProps) {
    super(props);
    this.state = {
      ctaButtonText: AuthButton[AuthMode.SIGN_UP],
      ctaQuestionText: CTAQuestion[AuthMode.SIGN_IN],
    };
  }

  componentDidMount() {
    this.props.setModeChangeCallback(() => {
      const currentMode: AuthMode = this.props.authMode;
      const previousMode: AuthMode =
        currentMode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN;
      this.setState({
        ctaButtonText: AuthButton[previousMode],
        ctaQuestionText: CTAQuestion[currentMode],
      });
    });
  }

  render() {
    const info_variants: { [key in AuthMode]: {} } = {
      [AuthMode.SIGN_IN]: this.props.isMobileView
        ? {
            left: 0,
            borderRadius: "10vw 10vw 0px 0px",
            boxShadow: "0px -3px 10px rgba(0, 0, 0, 0.25)",
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          }
        : {
            left: 0,
            borderRadius: "0vw 4vw 4vw 0vw",
            boxShadow: "9px 3px 10px rgba(0, 0, 0, 0.25)",
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          },
      [AuthMode.SIGN_UP]: this.props.isMobileView
        ? {
            left: 0,
            borderRadius: "10vw 10vw 0px 0px",
            boxShadow: "0px -3px 10px rgba(0, 0, 0, 0.25)",
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          }
        : {
            left: "50%",
            borderRadius: "4vw 0vw 0vw 4vw",
            boxShadow: "-9px 3px 10px rgba(0, 0, 0, 0.25)",
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          },
    };

    const cta_button_variants: { [key: string]: {} } = {
      [TransitionState.FIXED]: {
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
        color: "rgba(255,255,255,1)",
      },
      [TransitionState.TRANSITIONING]: {
        transition: {
          duration: Durations.MODE_CHANGE_MS / 1000,
        },
        color: [
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0)",
          "rgba(255,255,255,1)",
        ],
      },
      ON_HOVER: {
        color: "#073fda",
        backgroundColor: "rgba(255,255,255,1)",
        scale: 1.1,
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
      },
    };

    const cta_question_variants: { [key: string]: {} } = {
      [TransitionState.FIXED]: {
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
        color: "rgba(255,255,255,1)",
      },
      [TransitionState.TRANSITIONING]: {
        transition: {
          duration: Durations.MODE_CHANGE_MS / 1000,
        },
        color: [
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0)",
          "rgba(255,255,255,1)",
        ],
      },
    };

    return (
      <motion.section
        animate={
          this.props.authMode === AuthMode.SIGN_IN
            ? AuthMode.SIGN_IN
            : AuthMode.SIGN_UP
        }
        variants={info_variants}
        initial={AuthMode.SIGN_IN}
        className="infospaceDiv"
      >
        <section className="welcomeSection">
          <p className="welcomePara">Welcome</p>
          <p className="welcomeDescriptionPara">
            Your one stop solution for saving your passwords (lets please change
            this lmao)
          </p>
        </section>
        <section className="authCallToActionSection">
          <motion.p
            animate={
              this.props.transitionState === TransitionState.TRANSITIONING
                ? TransitionState.TRANSITIONING
                : TransitionState.FIXED
            }
            className="auth_CTA_question_para"
            variants={cta_question_variants}
          >
            {this.state.ctaQuestionText}
          </motion.p>
          <motion.button
            animate={
              this.props.transitionState === TransitionState.TRANSITIONING
                ? TransitionState.TRANSITIONING
                : TransitionState.FIXED
            }
            variants={cta_button_variants}
            transition={{ duration: 0.1 }}
            whileHover="ON_HOVER"
            whileTap={{ scale: 0.9 }}
            className="auth_CTA_button"
            onClick={this.props.changeAuthMode}
          >
            {this.state.ctaButtonText}
          </motion.button>
        </section>
      </motion.section>
    );
  }
}
