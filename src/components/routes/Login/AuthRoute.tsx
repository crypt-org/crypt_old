import React from "react";
import "./AuthRoute.scss";
import logo from "../../../assets/images/title_black.png";
import { motion } from 'framer-motion';
import FirebaseApp, { FirestoreDB } from '../../../services/Firebase/Firebase';
import { getAuth, signInWithEmailAndPassword, Auth, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

enum AuthMode {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

enum TransitionState {
  FIXED = "FIXED",
  TRANSITIONING = "TRANSITIONING"
}

const AuthTitle: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: 'Sign in to',
  [AuthMode.SIGN_UP]: 'Sign up for',
}

const AuthButton: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: 'sign in',
  [AuthMode.SIGN_UP]: 'sign up',
}

const CTAQuestion: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: 'Not a user?',
  [AuthMode.SIGN_UP]: 'Already a user?',
}

type AuthPageState = {
  authMode: AuthMode,
  transitionState: TransitionState,
  authTitle: string,
  authButtonText: string,
  ctaButtonText: string,
  ctaQuestionText: string,
  primaryInputPlaceholder: string,
  secondaryInputPlaceholder: string,
  secondaryInputType: string,
  primaryInputValue: string,
  secondaryInputValue: string
};

type AuthPageProps = {};

type AUTH_PAGE_CONSTANTS_CONTENT = {
  "ANIMATION_MODE_CHANGE_DURATION_MS": number,
  "ANIMATION_FAST_DURATION_MS": number,
  "VARIANT_HOVER_KEY": string,
  "VARIANT_TAP_KEY": string
  "INPUT_PLACEHOLDER_EMAIL": string,
  "INPUT_PLACEHOLDER_PASSWORD": string,
  "INPUT_PLACEHOLDER_NAME": string
  "INPUT_TYPE_TEXT": string,
  "INPUT_TYPE_PASSWORD": string
}
const AUTH_PAGE_CONSTANTS: AUTH_PAGE_CONSTANTS_CONTENT = {
  "ANIMATION_MODE_CHANGE_DURATION_MS": 1200,
  "ANIMATION_FAST_DURATION_MS": 100,
  "VARIANT_HOVER_KEY": "ON_HOVER",
  "VARIANT_TAP_KEY": "ON_TAP",
  "INPUT_PLACEHOLDER_EMAIL": "email",
  "INPUT_PLACEHOLDER_PASSWORD": "password",
  "INPUT_PLACEHOLDER_NAME": "name",
  "INPUT_TYPE_TEXT": "text",
  "INPUT_TYPE_PASSWORD": "password"
}

export default class AuthRoute extends React.PureComponent<
  AuthPageProps,
  AuthPageState
> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      authMode: AuthMode.SIGN_IN,
      transitionState: TransitionState.FIXED,
      authTitle: AuthTitle[AuthMode.SIGN_IN],
      authButtonText: AuthButton[AuthMode.SIGN_IN],
      ctaButtonText: AuthButton[AuthMode.SIGN_UP],
      ctaQuestionText: CTAQuestion[AuthMode.SIGN_IN],
      primaryInputPlaceholder: AUTH_PAGE_CONSTANTS.INPUT_PLACEHOLDER_EMAIL,
      secondaryInputPlaceholder: AUTH_PAGE_CONSTANTS.INPUT_PLACEHOLDER_PASSWORD,
      secondaryInputType: AUTH_PAGE_CONSTANTS.INPUT_TYPE_PASSWORD,
      primaryInputValue: "",
      secondaryInputValue: ""
    };
    this.authenticate = this.authenticate.bind(this);
    this.firebaseLogin = this.firebaseLogin.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  firebaseLogin(): Promise<UserCredential> {
    const auth: Auth = getAuth(FirebaseApp);
    return signInWithEmailAndPassword(auth, this.state.primaryInputValue, this.state.secondaryInputValue);
  }

  login(): void {
    this.firebaseLogin()
      .then((usercreds: UserCredential) => {
        console.log(usercreds);
      })
      .catch((error: {message: string}) => {
        console.log(error.message)
      });
  }

  async checkExistingUser(): Promise<boolean> {
    const docRef = doc(FirestoreDB, "crypts", this.state.secondaryInputValue);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  signup(): void {
    this.checkExistingUser().then((result: boolean) => console.log(result ? 'exists' : 'does not exist'));
  }

  authenticate(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const authentication_function: { [key in AuthMode]: (...params: any) => any } = {
      [AuthMode.SIGN_UP]: this.signup,
      [AuthMode.SIGN_IN]: this.login
    }
    e.preventDefault();
    authentication_function[this.state.authMode]();
  }

  getPrimaryUserInputName(): "email" | "name" {
    return this.state.authMode === AuthMode.SIGN_IN ? "email" : "name";
  }

  getSecondaryInputName(): "email" | "password" {
    return this.state.authMode === AuthMode.SIGN_IN ? "password" : "email";
  }

  getSecondaryInputType(): "text" | "password" {
    return this.state.authMode === AuthMode.SIGN_IN ? "password" : "text";
  }

  changeAuthMode(): void {
    const currentMode: AuthMode = this.state.authMode;
    const nextMode: AuthMode = currentMode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN;

    this.setState({
      authMode: nextMode,
      transitionState: TransitionState.TRANSITIONING
    });
    
    setTimeout(() => {
      this.setState({
        authTitle: AuthTitle[nextMode],
        authButtonText: AuthButton[nextMode],
        ctaButtonText: AuthButton[currentMode],
        ctaQuestionText: CTAQuestion[nextMode],
        primaryInputPlaceholder: this.getPrimaryUserInputName(),
        secondaryInputPlaceholder: this.getSecondaryInputName(),
        secondaryInputType: this.getSecondaryInputType(),
        primaryInputValue: "",
        secondaryInputValue: this.state.primaryInputValue !== "" ? this.state.primaryInputValue : ""
      });  
    }, (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 2));
  }

  resetTransitionState(): void {
    this.setState({ transitionState: TransitionState.FIXED });
  }

  getAuthSection(): JSX.Element {
    const auth_section_variants = {
      [AuthMode.SIGN_IN]: { right: 0, transition: { duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000), type: "tween", ease: "easeInOut" } },
      [AuthMode.SIGN_UP]: { right: '50%', transition: { duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000), type: "tween", ease: "easeInOut" } }
    };

    const submit_button_variants = {
      [TransitionState.FIXED]: {
        transition: {
          duration:  (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        },
        backgroundColor: 'rgba(255,255,255,1)'
      },
      [AUTH_PAGE_CONSTANTS.VARIANT_HOVER_KEY]: {
        scale: 1.1,
        color: 'rgba(255,255,255,1)',
        backgroundColor: '#1588CC',
        transition: {
          duration: (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        }
      },
      [AUTH_PAGE_CONSTANTS.VARIANT_TAP_KEY]: {
        scale: 0.9,
        transition: {
          duration: (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        }
      }
    }

    return (
      <motion.section
        animate={this.state.authMode === AuthMode.SIGN_IN ? AuthMode.SIGN_IN : AuthMode.SIGN_UP}
        variants={auth_section_variants}
        initial={AuthMode.SIGN_IN}
        onAnimationComplete={() => this.resetTransitionState()}
        className="signInSpaceDiv">
        <div className="signInTitleDiv">
          <motion.p className="signInTitleCTA">
            { this.state.authTitle }
          </motion.p>
          <img src={logo} alt="Crypt Logo" className="authTitleLogo" />
        </div>
        <form className="signInForm">
          <motion.input
            name={this.state.primaryInputPlaceholder}
            type="text"
            placeholder={this.state.primaryInputPlaceholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ primaryInputValue: e.target.value })}
            value={this.state.primaryInputValue}
            />
          <motion.input
            name={this.state.secondaryInputPlaceholder}
            type={this.state.secondaryInputType}
            placeholder={this.state.secondaryInputPlaceholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ secondaryInputValue: e.target.value })}
            value={this.state.secondaryInputValue}
            />
          <motion.button
            initial={TransitionState.FIXED}
            transition={{ duration: (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000) }}
            variants={submit_button_variants}
            whileHover={AUTH_PAGE_CONSTANTS.VARIANT_HOVER_KEY}
            whileTap={AUTH_PAGE_CONSTANTS.VARIANT_TAP_KEY}
            onClick={this.authenticate}
            type="submit">
            { this.state.authButtonText }
          </motion.button>
        </form>
      </motion.section>
    );
  }

  getInfoSection(): JSX.Element {
    
    const info_variants: { [key in AuthMode]: {} } = {
      [AuthMode.SIGN_IN]: { left: 0, borderRadius: '0px 100px 100px 0px', transition: { duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000), type: "tween", ease: "easeInOut" } },
      [AuthMode.SIGN_UP]: { left: '50%', borderRadius: '100px 0px 0px 100px', transition: { duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000), type: "tween", ease: "easeInOut" } }
    }

    const cta_button_variants: { [key: string]: {} } = {
      [TransitionState.FIXED]: {
        transition: {
          duration:  (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        },
        color: 'rgba(255,255,255,1)'
      },
      [TransitionState.TRANSITIONING]: {
        transition: {
          duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000)
        },
        color: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,1)']
      },
      "ON_HOVER": {
        color: '#073fda',
        backgroundColor: 'rgba(255,255,255,1)',
        scale: 1.1,
        transition: {
          duration:  (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        }
      }
    }

    const cta_question_variants: { [key: string]: {} } = {
      [TransitionState.FIXED]: {
        transition: {
          duration:  (AUTH_PAGE_CONSTANTS.ANIMATION_FAST_DURATION_MS / 1000)
        },
        color: 'rgba(255,255,255,1)'
      },
      [TransitionState.TRANSITIONING]: {
        transition: {
          duration: (AUTH_PAGE_CONSTANTS.ANIMATION_MODE_CHANGE_DURATION_MS / 1000)
        },
        color: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,1)']
      }
    }

    return (
      <motion.section
        animate={this.state.authMode === AuthMode.SIGN_IN ? AuthMode.SIGN_IN : AuthMode.SIGN_UP}
        variants={info_variants}
        initial={AuthMode.SIGN_IN}
        className="infospaceDiv">
        <section className="welcomeSection">
          <p className="welcomePara">Welcome</p>
          <p className="welcomeDescriptionPara">
            Your one stop solution for saving your passwords (lets please
            change this lmao)
          </p>
        </section>
        <section className="authCallToActionSection">
          <motion.p
            animate={this.state.transitionState === TransitionState.TRANSITIONING ? TransitionState.TRANSITIONING : TransitionState.FIXED}
            className="auth_CTA_question_para"
            variants={cta_question_variants}
            >
            { this.state.ctaQuestionText }
          </motion.p>
          <motion.button
            animate={this.state.transitionState === TransitionState.TRANSITIONING ? TransitionState.TRANSITIONING : TransitionState.FIXED}
            variants={cta_button_variants}
            transition={{ duration: 0.1 }}
            whileHover="ON_HOVER"
            whileTap={{ scale: 0.9 }}
            className="auth_CTA_button"
            onClick={() => this.changeAuthMode()}
          >
            { this.state.ctaButtonText }
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
