import React from "react";
import logo from "../../../../assets/images/title_black.png";
import { AnimatePresence, motion } from "framer-motion";
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

enum RegistrationAddOnStatus {
  SHOW = "show",
  HIDE = "hide",
}

export type AuthSectionProps = {
  authMode: AuthMode;
  transitionState: TransitionState;
  isMobileView: boolean;
  setModeChangeCallback: (callback: () => void) => void;
};
export type AuthSectionState = {
  registrationAddOnStatus: RegistrationAddOnStatus;
  emailValue: string;
  secondaryInputType: string;
  passwordValue: string;
  nameValue: string;
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
      emailValue: "",
      nameValue: "",
      passwordValue: "",
      registrationAddOnStatus: RegistrationAddOnStatus.HIDE,
      secondaryInputType: InputTypes.PASSWORD,
    };
  }

  componentDidMount() {
    // Setup Mode Change Callback
    this.props.setModeChangeCallback(() => {
      this.setState({
        authTitle: AuthTitle[this.props.authMode],
        authButtonText: AuthButton[this.props.authMode],
        registrationAddOnStatus:
          this.props.authMode === AuthMode.SIGN_UP
            ? RegistrationAddOnStatus.SHOW
            : RegistrationAddOnStatus.HIDE,
      });
    });
  }

  firebaseLogin(): Promise<UserCredential> {
    const auth: Auth = getAuth(FirebaseApp);
    return signInWithEmailAndPassword(
      auth,
      this.state.emailValue,
      this.state.passwordValue
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
    const docRef = doc(FirestoreDB, "crypts", this.state.emailValue);
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

    const registration_addon_variants: { [key: string]: {} } = {
      [RegistrationAddOnStatus.SHOW]: {
        height: "50px",
        paddingLeft: "30px",
        paddingRight: "30px",
        opacity: 1,
        transition: {
          duratiion: Durations.MODE_CHANGE_MS / 1000,
        },
      },
      [RegistrationAddOnStatus.HIDE]: {
        lineHeight: "0",
        padding: "0",
        border: "0",
        height: "0",
        margin: "0",
        transition: {
          duratiion: Durations.MODE_CHANGE_MS / 1000,
        },
      },
    };

    const submit_button_variants: { [key: string]: {} } = {
      [TransitionState.FIXED]: {
        opacity: 1,
        transition: {
          duration: Durations.FAST_MS / 1000,
        },
        backgroundColor: "rgba(255,255,255,1)",
      },
      [TransitionState.TRANSITIONING]: {
        color: ["#1588CC", "rgba(255,255,255,0)", "#1588CC"],
        transition: {
          duration: Durations.MODE_CHANGE_MS / 1000,
        },
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
        layoutId="authLayout"
        animate={
          this.props.authMode === AuthMode.SIGN_IN
            ? AuthMode.SIGN_IN
            : AuthMode.SIGN_UP
        }
        variants={auth_section_variants}
        initial={AuthMode.SIGN_IN}
        className="signInSpaceDiv"
      >
        <motion.div className="signInTitleDiv" layoutId="authLayout">
          <motion.p className="signInTitleCTA">{this.state.authTitle}</motion.p>
          <img src={logo} alt="Crypt Logo" className="authTitleLogo" />
        </motion.div>
        <form className="signInForm">
          <AnimatePresence>
            {this.state.registrationAddOnStatus ===
              RegistrationAddOnStatus.SHOW && (
              <motion.input
                layoutId="authLayout"
                key="name_input"
                name={InputNames.NAME}
                initial={RegistrationAddOnStatus.HIDE}
                animate={this.state.registrationAddOnStatus}
                variants={registration_addon_variants}
                exit={RegistrationAddOnStatus.HIDE}
                type="text"
                placeholder={InputNames.NAME}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  this.setState({ nameValue: e.target.value })
                }
                value={this.state.nameValue}
              />
            )}
          </AnimatePresence>
          <motion.input
            name={InputNames.EMAIL}
            type="text"
            placeholder={InputNames.EMAIL}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({ emailValue: e.target.value })
            }
            value={this.state.emailValue}
            layoutId="authLayout"
          />
          <div className="passwordInputContainer">
            <motion.input
              name={InputNames.PASSWORD}
              type="password"
              placeholder={InputNames.PASSWORD}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.setState({ passwordValue: e.target.value })
              }
              value={this.state.passwordValue}
              layoutId="authLayout"
            />
            <AnimatePresence>
              {this.state.registrationAddOnStatus ===
                RegistrationAddOnStatus.SHOW && (
                <motion.div
                  key="passwordStrength"
                  initial={{ width: "0%" }}
                  animate={{
                    width: "20%",
                    height: "10px",
                    transition: {
                      duration: Durations.MODE_CHANGE_MS / 1000,
                    },
                  }}
                  exit={{ height: "0", padding: "0", margin: "0" }}
                  className="passwordStrengthMeter"
                  layoutId="authLayout"
                />
              )}
            </AnimatePresence>
          </div>
          <motion.button
            initial={TransitionState.FIXED}
            animate={this.props.transitionState}
            transition={{
              duration: Durations.FAST_MS / 1000,
            }}
            variants={submit_button_variants}
            whileHover={CommonTransitionVariants.HOVER}
            whileTap={CommonTransitionVariants.TAP}
            onClick={this.authenticate}
            type="submit"
            layoutId="authLayout"
          >
            {this.state.authButtonText}
          </motion.button>
        </form>
      </motion.section>
    );
  }
}
