import FirebaseApp, {
  FirestoreDB,
} from "../../../../../services/firebase";
import {
  doc,
  getDocs,
  setDoc,
  collection,
  query,
  Query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  UserCredential,
} from "firebase/auth";
import forge, { pki } from "node-forge";

export interface LoginData {
  user: string;
  email: string;
}

export interface KeyData {
  pubKey: string;
  privKey: string;
}

export interface SignUpData extends LoginData {
  keys: KeyData;
}

async function firebaseLogin(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth: Auth = getAuth(FirebaseApp);
  return signInWithEmailAndPassword(auth, email, password);
}

export function login(email: string, password: string): void {
  firebaseLogin(email, password)
    .then((usercreds: UserCredential) => {
      console.log(usercreds);
    })
    .catch((error: { message: string }) => {
      console.log(error.message);
    });
}

async function isExistingUser(email: string): Promise<boolean> {
  const existingUserQuery: Query<any> = query(
    collection(FirestoreDB, "users"),
    where("email", "array-contains", email)
  );
  const docSnap = await getDocs(existingUserQuery);
  return !docSnap.empty;
}

async function generateSignUpData(
  password: string,
  onSignUpDataGenerationComplete: (generatedKeyData: KeyData) => void
): Promise<void> {
  const rsa: typeof pki.rsa = forge.pki.rsa;
  rsa.generateKeyPair({ bits: 2048, workers: 2 }, function (err, keypair) {
    if (err) {
      console.error(err);
      return;
    }
    const pki: typeof forge.pki = forge.pki;
    const encPri: string = pki.encryptRsaPrivateKey(
      keypair.privateKey,
      password,
      {
        algorithm: "aes256",
      }
    );
    const pub: string = pki.publicKeyToPem(keypair.publicKey);
    console.log(password)
    console.log(encPri)
    console.log(pub)
    onSignUpDataGenerationComplete({ pubKey: pub, privKey: encPri });
  });
}

export async function signup(
  name: string,
  email: string,
  password: string,
  onSignUpComplete: (signUpData: SignUpData | undefined, err: string | undefined) => void
): Promise<void> {
  const callback: (generatedKeyData: KeyData) => void = (
    generatedKeyData: KeyData
  ) => {
    const signUpData: SignUpData | undefined = !!generatedKeyData
      ? {
          user: name,
          email: email,
          keys: generatedKeyData,
        }
      : undefined;
      const err: string | undefined = !!generatedKeyData
      ? undefined
      : "Unable to generate account metadata";
      onSignUpComplete(signUpData, err);
  };

  await generateSignUpData(password, callback);
  return;
}
