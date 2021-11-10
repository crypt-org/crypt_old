import React from "react";
import logo from "../../../../assets/images/title_black.png";
import { motion } from "framer-motion";
import FirebaseApp, {
  FirestoreDB,
} from "../../../../services/Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  Auth,
  UserCredential,
} from "firebase/auth";
import {
  AuthMode,
  Durations,
  TransitionState,
  CommonTransitionVariants,
  InputNames,
  InputTypes,
  AuthTitle,
  AuthButton,
} from "../../constants";

export type AuthSectionProps = {
  authMode: AuthMode;
  isMobileView: boolean;
  setModeChangeCallback: (callback: () => void) => void;
};
export type AuthSectionState = {
  primaryInputPlaceholder: string;
  secondaryInputPlaceholder: string;
  primaryInputValue: string;
  secondaryInputType: string;
  secondaryInputValue: string;
  authTitle: string;
  authButtonText: string;
};

export default class AuthenticationSection extends React.PureComponent<
  AuthSectionProps,
  AuthSectionState
> {
  constructor(props: AuthSectionProps) {
    super(props);
    this.state = {
      authTitle: AuthTitle[AuthMode.SIGN_IN],
      authButtonText: AuthButton[AuthMode.SIGN_IN],
      primaryInputPlaceholder: InputNames.EMAIL,
      secondaryInputPlaceholder: InputNames.PASSWORD,
      primaryInputValue: "",
      secondaryInputValue: "",
      secondaryInputType: InputTypes.PASSWORD,
    };
  }

  componentDidMount() {
    // Setup Mode Change Callback
    this.props.setModeChangeCallback(() => {
      const primaryInputValue: string =
        this.props.authMode === AuthMode.SIGN_IN
          ? this.state.secondaryInputValue
          : "";
      const secondaryInputValue: string =
        this.props.authMode === AuthMode.SIGN_UP
          ? this.state.primaryInputValue
          : "";
      const secondaryInputType: string =
        this.props.authMode === AuthMode.SIGN_IN
          ? InputTypes.PASSWORD
          : InputTypes.TEXT;
      const secondaryInputPlaceholder: string =
        this.props.authMode === AuthMode.SIGN_IN
          ? InputNames.PASSWORD
          : InputNames.EMAIL;
      const primaryInputPlaceholder: string =
        this.props.authMode === AuthMode.SIGN_IN
          ? InputNames.EMAIL
          : InputNames.NAME;

      this.setState({
        authTitle: AuthTitle[this.props.authMode],
        authButtonText: AuthButton[this.props.authMode],
        primaryInputPlaceholder: primaryInputPlaceholder,
        secondaryInputPlaceholder: secondaryInputPlaceholder,
        secondaryInputType: secondaryInputType,
        primaryInputValue: primaryInputValue,
        secondaryInputValue: secondaryInputValue,
      });
    });
  }

  firebaseLogin(): Promise<UserCredential> {
    const auth: Auth = getAuth(FirebaseApp);
    return signInWithEmailAndPassword(
      auth,
      this.state.primaryInputValue,
      this.state.secondaryInputValue
    );
  }

  login(): void {
    this.firebaseLogin()
      .then((usercreds: UserCredential) => {
        console.log(usercreds);
      })
      .catch((error: { message: string }) => {
        console.log(error.message);
      });
  }

  async checkExistingUser(): Promise<boolean> {
    const docRef = doc(FirestoreDB, "crypts", this.state.secondaryInputValue);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  signup(): void {
    this.checkExistingUser().then((result: boolean) =>
      console.log(result ? "exists" : "does not exist")
    );
  }

  authenticate(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const authentication_function: {
      [key in AuthMode]: (...params: any) => any;
    } = {
      [AuthMode.SIGN_UP]: this.signup,
      [AuthMode.SIGN_IN]: this.login,
    };
    e.preventDefault();
    authentication_function[this.props.authMode]();
  }

  render() {
    const auth_section_variants = {
      [AuthMode.SIGN_IN]: this.props.isMobileView
        ? {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          }
        : {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          },
      [AuthMode.SIGN_UP]: this.props.isMobileView
        ? {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          }
        : {
            right: "50%",
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: "tween",
              ease: "easeInOut",
            },
          },
    };

    const submit_button_variants = {
      [TransitionState.FIXED]: {
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
        backgroundColor: "rgba(255,255,255,1)",
      },
      [CommonTransitionVariants.HOVER]: {
        scale: 1.1,
        color: "rgba(255,255,255,1)",
        backgroundColor: "#1588CC",
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
      },
      [CommonTransitionVariants.TAP]: {
        scale: 0.9,
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
      },
    };

    return (
      <motion.section
        animate={
          this.props.authMode === AuthMode.SIGN_IN
            ? AuthMode.SIGN_IN
            : AuthMode.SIGN_UP
        }
        variants={auth_section_variants}
        initial={AuthMode.SIGN_IN}
        className="signInSpaceDiv"
      >
        <div className="signInTitleDiv">
          <motion.p className="signInTitleCTA">{this.state.authTitle}</motion.p>
          <img src={logo} alt="Crypt Logo" className="authTitleLogo" />
        </div>
        <form className="signInForm">
          <motion.input
            name={this.state.primaryInputPlaceholder}
            type="text"
            placeholder={this.state.primaryInputPlaceholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({ primaryInputValue: e.target.value })
            }
            value={this.state.primaryInputValue}
          />
          <motion.input
            name={this.state.secondaryInputPlaceholder}
            type={this.state.secondaryInputType}
            placeholder={this.state.secondaryInputPlaceholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({ secondaryInputValue: e.target.value })
            }
            value={this.state.secondaryInputValue}
          />
          <motion.button
            initial={TransitionState.FIXED}
            transition={{
              duration: Durations.FAST_MS / 1000,
            }}
            variants={submit_button_variants}
            whileHover={CommonTransitionVariants.HOVER}
            whileTap={CommonTransitionVariants.TAP}
            onClick={this.authenticate}
            type="submit"
          >
            {this.state.authButtonText}
          </motion.button>
        </form>
      </motion.section>
    );
  }
}
