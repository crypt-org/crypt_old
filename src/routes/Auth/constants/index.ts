export const TITLE_TEXT_SIGN_IN: string = 'Sign in to';
export const TITLE_TEXT_SIGN_UP: string = 'Sign up for';

export const BUTTON_TEXT_SIGN_IN: string = 'sign in';
export const BUTTON_TEXT_SIGN_UP: string = 'sign up';

export const CTA_TEXT_SIGN_UP: string = 'Not a user?';
export const CTA_TEXT_SIGN_IN: string = 'Already a user?';

export enum InputNames {
  NAME = 'name',
  PASSWORD = 'password',
  EMAIL = 'email',
}

export enum InputTypes {
  TEXT = 'text',
  PASSWORD = 'password',
}

export enum TransitionState {
  FIXED = 'FIXED',
  TRANSITIONING = 'TRANSITIONING',
}

export enum AuthMode {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
}

export enum Durations {
  MODE_CHANGE_MS = 1200,
  FAST_MS = 100,
  MEDIUM_MS = 560,
}

export enum CommonTransitionVariants {
  HOVER = 'ON_HOVER',
  TAP = 'ON_TAP',
}

export const AuthTitle: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: TITLE_TEXT_SIGN_IN,
  [AuthMode.SIGN_UP]: TITLE_TEXT_SIGN_UP,
};

export const AuthButton: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: BUTTON_TEXT_SIGN_IN,
  [AuthMode.SIGN_UP]: BUTTON_TEXT_SIGN_UP,
};

export const CTAQuestion: { [key in AuthMode]: string } = {
  [AuthMode.SIGN_IN]: CTA_TEXT_SIGN_UP,
  [AuthMode.SIGN_UP]: CTA_TEXT_SIGN_IN,
};
