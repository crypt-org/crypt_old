import { UserCredential } from 'firebase/auth';
import forge, { pki } from 'node-forge';
import {
  signInWithFireauth,
  signUpWithFireauth,
} from '../../../../../services/fireauth';

export interface LoginData {
  user: string;
  email: string;
}

export interface MetaData {
  pubKey: string;
  privKey: string;
  uid: string;
}

export interface SignUpData extends LoginData {
  metadata: MetaData;
}

export function login(email: string, password: string): void {
  signInWithFireauth(email, password)
    .then((usercreds: UserCredential) => {
      console.log(usercreds);
    })
    .catch((error: { message: string }) => {
      console.log(error.message);
    });
}

async function generateSignUpData(
  email: string,
  password: string,
  onSignUpDataGenerationComplete: (generatedMetaData: MetaData) => void,
  credentials: UserCredential
): Promise<void> {
  const rsa: typeof pki.rsa = forge.pki.rsa;
  rsa.generateKeyPair(
    { bits: 2048, workers: 2 },
    async function (err, keypair) {
      if (err) {
        console.error(err);
        return;
      }
      const pki: typeof forge.pki = forge.pki;
      const encPri: string = pki.encryptRsaPrivateKey(
        keypair.privateKey,
        password,
        {
          algorithm: 'aes256',
        }
      );
      const pub: string = pki.publicKeyToPem(keypair.publicKey);
      console.log(password);
      console.log(encPri);
      console.log(pub);
      if (!credentials) {
        return;
      }
      onSignUpDataGenerationComplete({
        pubKey: pub,
        privKey: encPri,
        uid: credentials.user.uid,
      });
    }
  );
}

export async function signup(
  name: string,
  email: string,
  password: string,
  onSignUpComplete: (
    signUpData: SignUpData | undefined,
    err: string | undefined
  ) => void
): Promise<void> {
  const callback: (metaData: MetaData) => void = (metaData: MetaData) => {
    const signUpData: SignUpData | undefined = !!metaData
      ? {
          user: name,
          email: email,
          metadata: metaData,
        }
      : undefined;
    const err: string | undefined = !!metaData
      ? undefined
      : 'Unable to generate account metadata!';
    onSignUpComplete(signUpData, err);
  };

  const creds: UserCredential | undefined = await signUpWithFireauth(
    email,
    password
  );
  creds && (await generateSignUpData(email, password, callback, creds));
  return;
}
