import React from 'react';
import logo from '../../../../assets/images/title_black.png';
import { AnimatePresence, motion } from 'framer-motion';
import zxcvbn from 'zxcvbn';
import {
  AuthMode,
  Durations,
  TransitionState,
  CommonTransitionVariants,
  InputNames,
  InputTypes,
  AuthTitle,
  AuthButton,
} from '../../constants';
import { signup, login } from './logic';

enum RegistrationAddOnStatus {
  SHOW = 'show',
  HIDE = 'hide',
}

enum PasswordStrengthBarColours {
  WEAK = '#DD5D5D',
  MEDIUM = '#FFC700',
  STRONG = '#23EB4F',
}

enum PasswordInputColours {
  DEFAULT = '#CACACA7F',
  WEAK = '#DD5D5D96',
  MEDIUM = '#FFC70096',
  STRONG = '#23EB4F96',
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
  passwordVisibility: boolean;
  passwordStrengthWidth: number;
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
      emailValue: '',
      passwordStrengthWidth: 0,
      passwordVisibility: false,
      nameValue: '',
      passwordValue: '',
      registrationAddOnStatus: RegistrationAddOnStatus.HIDE,
      secondaryInputType: InputTypes.PASSWORD,
    };

    this.authenticate = this.authenticate.bind(this);
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
        nameValue: '',
      });
    });
  }

  evaluateSignUpPassword(newPass: string): void {
    const strengthPercen: number =
      newPass === '' ? 0 : (zxcvbn(newPass).score / 4) * 90 + 10; // Scale output between 10 & 100 if newPass is not empty
    this.setState({ passwordStrengthWidth: strengthPercen });
  }

  fetchPasswordBarColour(): string {
    if (this.state.passwordStrengthWidth < 50) {
      return PasswordStrengthBarColours.WEAK;
    } else if (this.state.passwordStrengthWidth < 99) {
      return PasswordStrengthBarColours.MEDIUM;
    } else {
      return PasswordStrengthBarColours.STRONG;
    }
  }

  fetchPasswordInputColour(): string {
    if (
      this.props.authMode === AuthMode.SIGN_IN ||
      this.state.passwordStrengthWidth === 0
    ) {
      return PasswordInputColours.DEFAULT;
    } else if (this.state.passwordStrengthWidth < 50) {
      return PasswordInputColours.WEAK;
    } else if (this.state.passwordStrengthWidth < 99) {
      return PasswordInputColours.MEDIUM;
    } else {
      return PasswordInputColours.STRONG;
    }
  }

  authenticate(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.preventDefault();
    const authentication_function: {
      [key in AuthMode]: (...params: any) => any;
    } = {
      [AuthMode.SIGN_UP]: () =>
        signup(
          this.state.nameValue,
          this.state.emailValue,
          this.state.passwordValue
        ),
      [AuthMode.SIGN_IN]: () =>
        login(this.state.emailValue, this.state.passwordValue),
    };

    authentication_function[this.props.authMode]();
  }

  render() {
    const auth_section_variants = {
      [AuthMode.SIGN_IN]: this.props.isMobileView
        ? {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: 'tween',
              ease: 'easeInOut',
            },
          }
        : {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: 'tween',
              ease: 'easeInOut',
            },
          },
      [AuthMode.SIGN_UP]: this.props.isMobileView
        ? {
            right: 0,
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: 'tween',
              ease: 'easeInOut',
            },
          }
        : {
            right: '50%',
            transition: {
              duration: Durations.MODE_CHANGE_MS / 1000,
              type: 'tween',
              ease: 'easeInOut',
            },
          },
    };

    const registration_addon_variants: { [key: string]: {} } = {
      [RegistrationAddOnStatus.SHOW]: {
        height: '50px',
        paddingLeft: '30px',
        paddingRight: '30px',
        opacity: 1,
        transition: {
          duratiion: Durations.MODE_CHANGE_MS / 1000,
        },
      },
      [RegistrationAddOnStatus.HIDE]: {
        lineHeight: '0',
        padding: '0',
        border: '0',
        height: '0',
        margin: '0',
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
        backgroundColor: 'rgba(255,255,255,1)',
      },
      [TransitionState.TRANSITIONING]: {
        color: ['#1588CC', 'rgba(255,255,255,0)', '#1588CC'],
        transition: {
          duration: Durations.MODE_CHANGE_MS / 1000,
        },
      },
      [CommonTransitionVariants.HOVER]: {
        scale: 1.1,
        color: 'rgba(255,255,255,1)',
        backgroundColor: '#1588CC',
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
        layoutId='authLayout'
        animate={
          this.props.authMode === AuthMode.SIGN_IN
            ? AuthMode.SIGN_IN
            : AuthMode.SIGN_UP
        }
        variants={auth_section_variants}
        initial={AuthMode.SIGN_IN}
        className='signInSpaceDiv'
      >
        <motion.div className='signInTitleDiv' layoutId='authLayout'>
          <motion.p className='signInTitleCTA'>{this.state.authTitle}</motion.p>
          <img src={logo} alt='Crypt Logo' className='authTitleLogo' />
        </motion.div>
        <form className='signInForm'>
          <AnimatePresence>
            {this.state.registrationAddOnStatus ===
              RegistrationAddOnStatus.SHOW && (
              <motion.input
                layoutId='authLayout'
                key='name_input'
                name={InputNames.NAME}
                initial={RegistrationAddOnStatus.HIDE}
                animate={this.state.registrationAddOnStatus}
                variants={registration_addon_variants}
                exit={RegistrationAddOnStatus.HIDE}
                type='text'
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
            type='text'
            placeholder={InputNames.EMAIL}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({ emailValue: e.target.value })
            }
            value={this.state.emailValue}
            layoutId='authLayout'
          />
          <div className='passwordInputContainer'>
            <motion.input
              name={InputNames.PASSWORD}
              type={
                this.props.authMode === AuthMode.SIGN_UP &&
                this.state.passwordVisibility
                  ? 'text'
                  : 'password'
              }
              placeholder={InputNames.PASSWORD}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ passwordValue: e.target.value });
                this.evaluateSignUpPassword(e.target.value);
              }}
              initial={{ backgroundColor: this.fetchPasswordInputColour() }}
              animate={{ backgroundColor: this.fetchPasswordInputColour() }}
              onHoverStart={() => this.setState({ passwordVisibility: true })}
              onHoverEnd={() => this.setState({ passwordVisibility: false })}
              value={this.state.passwordValue}
              layoutId='authLayout'
            />
            <AnimatePresence>
              {this.state.registrationAddOnStatus ===
                RegistrationAddOnStatus.SHOW && (
                <motion.div
                  key='passwordStrength'
                  initial={{
                    width: '0%',
                    backgroundColor: PasswordStrengthBarColours.WEAK,
                  }}
                  animate={{
                    width: `${this.state.passwordStrengthWidth}%`,
                    height: '10px',
                    backgroundColor: this.fetchPasswordBarColour(),
                    transition: {
                      duration: Durations.MODE_CHANGE_MS / 2000,
                    },
                  }}
                  exit={{ height: '0', padding: '0', margin: '0' }}
                  className='passwordStrengthMeter'
                  layoutId='authLayout'
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
            type='submit'
            layoutId='authLayout'
          >
            {this.state.authButtonText}
          </motion.button>
        </form>
      </motion.section>
    );
  }
}
