import { UserCredential } from 'firebase/auth';
import CryptModel from '../../../../../models/crypt';
import UserModel from '../../../../../models/user';
import CryptService from '../../../../../services/crypt';
import EncryptionService from '../../../../../services/encryption';
import {
  signInWithFireauth,
  signUpWithFireauth,
} from '../../../../../services/fireauth';
import {
  firestoreDocCreation,
  getEncryptedCrypt,
  getEncryptedPrivateKey,
  getUserData,
} from '../../../../../services/firestore';
import { Firestore_UserModel } from '../../../../../services/firestore/constants';
import Factory_User from '../../../../../services/user';
import zxcvbn from 'zxcvbn';
import { PasswordStrengthBarColours, PasswordInputColours } from '../constants';
import { AuthMode } from '../../../constants';

export interface LoginData {
  name: string;
  email: string;
  uid: string;
}

export interface KeyData {
  pub: string;
  priv: string;
}

export async function login(
  email: string,
  password: string,
  onLoginComplete: (
    authenticatedUser: UserModel,
    cryptModel: CryptModel
  ) => void
): Promise<void> {
  try {
    const userCreds: UserCredential = await signInWithFireauth(email, password);
    const encryptedPrivateKey: string | undefined =
      await getEncryptedPrivateKey(userCreds.user.uid);
    const encryptedCrypt: string | undefined = await getEncryptedCrypt(
      userCreds.user.uid
    );
    const userData: Firestore_UserModel | undefined = await getUserData(
      userCreds.user.uid
    );

    if (!encryptedPrivateKey || !encryptedCrypt || !userData) {
      return;
    }
    const authenticatedUserModel: UserModel = Factory_User.BuildUserModel(
      userData.email,
      userData.name,
      userData.uid,
      userData.pub
    );
    const decryptedCrypt: CryptModel = EncryptionService.DecryptCrypt(
      EncryptionService.DecryptRSAPrivateKey(password, encryptedPrivateKey),
      encryptedCrypt
    );

    onLoginComplete(authenticatedUserModel, decryptedCrypt);
  } catch (e) {
    console.error(e);
    return; //$ Login does not complete on any error.
  }
}

export async function signup(
  name: string,
  email: string,
  password: string,
  onSignUpComplete: (
    authenticatedUser: UserModel,
    cryptModel: CryptModel
  ) => void
): Promise<void> {
  const callback: (metaData: KeyData) => void = async (keyData: KeyData) => {
    try {
      const creds: UserCredential | undefined = await signUpWithFireauth(
        email,
        password
      );

      const userData: (LoginData & KeyData) | undefined =
        !!keyData && !!creds
          ? {
              name: name,
              email: email,
              uid: creds.user.uid,
              ...keyData,
            }
          : undefined;

      !!userData &&
        !!creds &&
        firestoreDocCreation(
          userData,
          EncryptionService.EncryptCrpyt(
            userData.pub,
            CryptService.GetNewCrypt()
          )
        );

      !!userData &&
        !!creds &&
        onSignUpComplete(
          Factory_User.BuildUserModel(
            userData.email,
            userData.name,
            userData.uid,
            userData.pub
          ),
          CryptService.GetNewCrypt()
        );
    } catch (e) {
      console.error(e);
      return; //$ Sign Up does not complete on any error.
    }
  };

  EncryptionService.GenerateRSAKeysWithPassword(password, callback);
  return;
}

export const AuthSectionHelpers: {
  getSignUpPasswdStrengthIndicator: (newPass: string) => number;
  evaluatePasswordBarColour: (passwdStrengthPercent: number) => string;
  fetchPasswordInputColour: (
    authMode: AuthMode,
    passwdStrengthPercent: number
  ) => string;
} = {
  getSignUpPasswdStrengthIndicator: (newPass: string) => {
    const strengthPercent: number =
      newPass === '' ? 0 : (zxcvbn(newPass).score / 4) * 90 + 10; // Scale output between 10 & 100 if newPass is not empty
    return strengthPercent;
  },
  evaluatePasswordBarColour: (passwdStrengthPercent: number) => {
    if (passwdStrengthPercent < 50) {
      return PasswordStrengthBarColours.WEAK;
    } else if (passwdStrengthPercent < 99) {
      return PasswordStrengthBarColours.MEDIUM;
    } else {
      return PasswordStrengthBarColours.STRONG;
    }
  },
  fetchPasswordInputColour: (
    authMode: AuthMode,
    passwdStrengthPercent: number
  ) => {
    if (authMode === AuthMode.SIGN_IN || passwdStrengthPercent === 0) {
      return PasswordInputColours.DEFAULT;
    } else if (passwdStrengthPercent < 50) {
      return PasswordInputColours.WEAK;
    } else if (passwdStrengthPercent < 99) {
      return PasswordInputColours.MEDIUM;
    } else {
      return PasswordInputColours.STRONG;
    }
  },
};
