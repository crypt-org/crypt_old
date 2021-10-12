import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./LoginRoute.scss";
import logo from "../../../assets/images/title_black.png";
import { motion } from 'framer-motion';

enum AuthMode {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

type AuthPageState = {
  authMode: AuthMode;
};

type AuthPageProps = {};

export default class LoginRoute extends React.PureComponent<
  AuthPageProps,
  AuthPageState
> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      authMode: AuthMode.SIGN_IN,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ authMode: AuthMode.SIGN_UP })
    }, 2000);
  }



  getAuthSection(): JSX.Element {

    const auth_section_variants = {
      [AuthMode.SIGN_IN]: { right: 0 },
      [AuthMode.SIGN_UP]: { right: '50%' }
    }

    const auth_title_variants = {
      FIXED: {
        opacity: 1
      },
      TRANSITIONING: {
        opacity: [1, 0, 1]
      }
    }

    return (
      <motion.section
        animate={this.state.authMode === AuthMode.SIGN_IN ? AuthMode.SIGN_IN : AuthMode.SIGN_UP}
        variants={auth_section_variants}
        initial={AuthMode.SIGN_IN}
        transition={{ duration: 1 }}
        className="signInSpaceDiv">
        <div className="signInTitleDiv">
          <motion.p
            animate={this.state.authMode === AuthMode.SIGN_IN ? AuthMode.SIGN_IN : AuthMode.SIGN_UP}
            transition={{ delay: 1 }}
            className="signInTitleCTA"
            >
              {this.state.authMode === AuthMode.SIGN_IN ? 'Sign in to' : 'Sign up with'}
          </motion.p>
          <img src={logo} className="authTitleLogo" />
        </div>
        <form className="signInForm">
          <input name="name" type="text" placeholder="name"></input>
          <input name="email" type="email" placeholder="email"></input>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            type="submit">
            sign in
          </motion.button>
        </form>
      </motion.section>
    );
  }

  getInfoSection(): JSX.Element {
    
    const info_variants = {
      [AuthMode.SIGN_IN]: { left: 0, borderRadius: '0px 100px 100px 0px' },
      [AuthMode.SIGN_UP]: { left: '50%', borderRadius: '100px 0px 0px 100px' }
    }

    return (
      <motion.section
        animate={this.state.authMode === AuthMode.SIGN_IN ? AuthMode.SIGN_IN : AuthMode.SIGN_UP}
        variants={info_variants}
        initial={AuthMode.SIGN_IN}
        transition={{ duration: 1 }}
        className="infospaceDiv">
        <section className="welcomeSection">
          <p className="welcomePara">Welcome</p>
          <p className="welcomeDescriptionPara">
            Your one stop solution for saving your passwords (lets please
            change this lmao)
          </p>
        </section>
        <section className="authCallToActionSection">
          <p className="auth_CTA_question_para">Not a user?</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="auth_CTA_button"
            onClick={() => alert("sign in clicked!")}
          >
            sign up
          </motion.button>
        </section>
      </motion.section>
    );
  }

  render(): JSX.Element {

    return (
      <div className="authPageDiv">
        { this.getInfoSection() }
        { this.getAuthSection() }
      </div>
    );
  }
}
