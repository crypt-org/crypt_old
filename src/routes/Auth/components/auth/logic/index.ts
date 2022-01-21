import { UserCredential } from 'firebase/auth';
import CryptService from '../../../../../services/crypt';
import EncryptionService from '../../../../../services/encryption';
import {
  signInWithFireauth,
  signUpWithFireauth,
} from '../../../../../services/fireauth';
import { firestoreDocCreation } from '../../../../../services/firestore';

export interface LoginData {
  user: string;
  email: string;
  uid: string;
}

export interface KeyData {
  pubKey: string;
  privKey: string;
}

export interface SignUpData extends LoginData {
  keyData: KeyData;
}

export async function login(
  email: string,
  password: string,
  onLoginComplete: (isLoginSuccess: boolean) => void
): Promise<void> {
  signInWithFireauth(email, password)
    .then((usercreds: UserCredential) => {
      console.log(usercreds);
      onLoginComplete(true);
    })
    .catch((error: { message: string }) => {
      console.log(error.message);
      onLoginComplete(false);
    });
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<void> {
  const callback: (metaData: KeyData) => void = async (keyData: KeyData) => {
    const creds: UserCredential | undefined = await signUpWithFireauth(
      email,
      password
    );
    const signUpData: SignUpData | undefined =
      !!keyData && !!creds
        ? {
            user: name,
            email: email,
            uid: creds.user.uid,
            keyData: keyData,
          }
        : undefined;

    !!signUpData &&
      firestoreDocCreation(
        signUpData,
        EncryptionService.EncryptCrpyt(
          signUpData.keyData.pubKey,
          CryptService.GetNewCrypt()
        )
      );
  };

  EncryptionService.GenerateRSAKeysWithPassword(password, callback);
  return;
}
