import React, { useEffect, useState } from 'react';
import logo from '../../../../assets/images/title_black.png';
import { AnimatePresence, motion } from 'framer-motion';
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
import { RootState } from '../../../../services/redux/Redux';
import { Redirect } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../services/redux/hooks';
import { loginUser } from '../../../../services/redux/config/User';
import UserModel from '../../../../models/user';
import CryptModel from '../../../../models/crypt';
import { updateCrypt } from '../../../../services/redux/config/Crypt';
import {
  RegistrationAddOnStatus,
  PasswordStrengthBarColours,
  AuthSectionVariantFactory,
} from './constants';
import { AuthSectionHelpers } from './logic';

export type AuthSectionProps = {
  authMode: AuthMode;
  transitionState: TransitionState;
  isMobileView: boolean;
  setModeChangeCallback: (callback: () => void) => void;
};

const AuthenticationSection: React.FC<AuthSectionProps> = (
  props: AuthSectionProps
) => {
  const [state, setState] = useState({
    authTitle: AuthTitle[AuthMode.SIGN_IN],
    authButtonText: AuthButton[AuthMode.SIGN_IN],
    emailValue: '',
    passwordStrengthWidth: 0,
    passwordVisibility: false,
    nameValue: '',
    passwordValue: '',
    registrationAddOnStatus: RegistrationAddOnStatus.HIDE,
    secondaryInputType: InputTypes.PASSWORD,
    isAuthenticationSuccess: useAppSelector(
      (state: RootState) =>
        !!state.user.email &&
        !!state.user.name &&
        !!state.user.pub &&
        !!state.user.pub &&
        !!state.user.uid
    ),
  });

  const state_dispatcher = useAppDispatch();

  useEffect(() => {
    props.setModeChangeCallback(() => {
      setState({
        ...state,
        authTitle: AuthTitle[props.authMode],
        authButtonText: AuthButton[props.authMode],
        registrationAddOnStatus:
          props.authMode === AuthMode.SIGN_UP
            ? RegistrationAddOnStatus.SHOW
            : RegistrationAddOnStatus.HIDE,
        nameValue: '',
      });
    });

    // * We only want this function to re-run on changes to {props.authMode}
    // * Without es-lint-disable-next-line, eslint will throw a warning that
    // * {props} and {state} were not included in the dependencies.
    // eslint-disable-next-line
  }, [props.authMode]);

  function authenticate(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.preventDefault();
    const post_authentication_state_callbacks: {
      [key in AuthMode]: (
        authenticatedUser: UserModel,
        cryptModel: CryptModel
      ) => any;
    } = {
      [AuthMode.SIGN_UP]: (
        authenticatedUser: UserModel,
        cryptModel: CryptModel
      ) => {
        if (!authenticatedUser || !cryptModel) {
          return;
        }
        state_dispatcher(loginUser(authenticatedUser));
        state_dispatcher(updateCrypt(cryptModel));
        setState({ ...state, isAuthenticationSuccess: true });
      },
      [AuthMode.SIGN_IN]: (
        authenticatedUser: UserModel,
        cryptModel: CryptModel
      ) => {
        if (!authenticatedUser || !cryptModel) {
          return;
        }
        state_dispatcher(loginUser(authenticatedUser));
        state_dispatcher(updateCrypt(cryptModel));
        setState({ ...state, isAuthenticationSuccess: true });
      },
    };
    const authentication_function: {
      [key in AuthMode]: (...params: any) => any;
    } = {
      [AuthMode.SIGN_UP]: () =>
        signup(
          state.nameValue,
          state.emailValue,
          state.passwordValue,
          post_authentication_state_callbacks[AuthMode.SIGN_UP]
        ),
      [AuthMode.SIGN_IN]: () =>
        login(
          state.emailValue,
          state.passwordValue,
          post_authentication_state_callbacks[AuthMode.SIGN_IN]
        ),
    };

    authentication_function[props.authMode]();
  }

  return state.isAuthenticationSuccess ? (
    <Redirect to='/home' />
  ) : (
    <motion.section
      layoutId='authLayout'
      animate={
        props.authMode === AuthMode.SIGN_IN
          ? AuthMode.SIGN_IN
          : AuthMode.SIGN_UP
      }
      variants={AuthSectionVariantFactory.generateAuthSectionVariants(
        props.isMobileView
      )}
      initial={AuthMode.SIGN_IN}
      className='signInSpaceDiv'
    >
      <motion.div className='signInTitleDiv' layoutId='authLayout'>
        <motion.p className='signInTitleCTA'>{state.authTitle}</motion.p>
        <img src={logo} alt='Crypt Logo' className='authTitleLogo' />
      </motion.div>
      <form className='signInForm'>
        <AnimatePresence>
          {state.registrationAddOnStatus === RegistrationAddOnStatus.SHOW && (
            <motion.input
              layoutId='authLayout'
              key='name_input'
              name={InputNames.NAME}
              initial={RegistrationAddOnStatus.HIDE}
              animate={state.registrationAddOnStatus}
              variants={AuthSectionVariantFactory.generateRegistrationAddOnVariants()}
              exit={RegistrationAddOnStatus.HIDE}
              type='text'
              placeholder={InputNames.NAME}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setState({ ...state, nameValue: e.target.value })
              }
              value={state.nameValue}
            />
          )}
        </AnimatePresence>
        <motion.input
          name={InputNames.EMAIL}
          type='text'
          placeholder={InputNames.EMAIL}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setState({ ...state, emailValue: e.target.value })
          }
          value={state.emailValue}
          layoutId='authLayout'
        />
        <div className='passwordInputContainer'>
          <motion.input
            name={InputNames.PASSWORD}
            type={
              props.authMode === AuthMode.SIGN_UP && state.passwordVisibility
                ? 'text'
                : 'password'
            }
            placeholder={InputNames.PASSWORD}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setState({
                ...state,
                passwordValue: e.target.value,
                passwordStrengthWidth:
                  AuthSectionHelpers.getSignUpPasswdStrengthIndicator(
                    e.target.value
                  ),
              });
            }}
            initial={{
              backgroundColor: AuthSectionHelpers.fetchPasswordInputColour(
                props.authMode,
                state.passwordStrengthWidth
              ),
            }}
            animate={{
              backgroundColor: AuthSectionHelpers.fetchPasswordInputColour(
                props.authMode,
                state.passwordStrengthWidth
              ),
            }}
            onHoverStart={() =>
              setState({ ...state, passwordVisibility: true })
            }
            onHoverEnd={() => setState({ ...state, passwordVisibility: false })}
            value={state.passwordValue}
            layoutId='authLayout'
          />
          <AnimatePresence>
            {state.registrationAddOnStatus === RegistrationAddOnStatus.SHOW && (
              <motion.div
                key='passwordStrength'
                initial={{
                  width: '0%',
                  backgroundColor: PasswordStrengthBarColours.WEAK,
                }}
                animate={{
                  width: `${state.passwordStrengthWidth}%`,
                  height: '10px',
                  backgroundColor: AuthSectionHelpers.evaluatePasswordBarColour(
                    state.passwordStrengthWidth
                  ),
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
          animate={props.transitionState}
          transition={{
            duration: Durations.FAST_MS / 1000,
          }}
          variants={AuthSectionVariantFactory.generateSubmitButtonVariants()}
          whileHover={CommonTransitionVariants.HOVER}
          whileTap={CommonTransitionVariants.TAP}
          onClick={authenticate}
          type='submit'
          layoutId='authLayout'
        >
          {state.authButtonText}
        </motion.button>
      </form>
    </motion.section>
  );
};

export default AuthenticationSection;
