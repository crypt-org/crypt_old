import {
  AuthMode,
  Durations,
  TransitionState,
  CommonTransitionVariants,
} from "../../../constants";

import { AuthSectionProps } from "..";

export enum RegistrationAddOnStatus {
  SHOW = "show",
  HIDE = "hide",
}

export enum PasswordStrengthBarColours {
  WEAK = "#DD5D5D",
  MEDIUM = "#FFC700",
  STRONG = "#23EB4F",
}

export enum PasswordInputColours {
  DEFAULT = "#CACACA7F",
  WEAK = "#DD5D5D96",
  MEDIUM = "#FFC70096",
  STRONG = "#23EB4F96",
}

export const Factory_Auth_Section_Variants: (props: AuthSectionProps) => {
  [key: string]: {};
} = (props: AuthSectionProps) => ({
  [AuthMode.SIGN_IN]: props.isMobileView
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
  [AuthMode.SIGN_UP]: props.isMobileView
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
});

export const Factory_Registration_AddOn_Variants: () => { [key: string]: {} } =
  () => ({
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
  });

export const Factory_Submit_Button_Variants: () => { [key: string]: {} } =
  () => ({
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
  });
