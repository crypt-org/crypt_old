import FirebaseApp from '../firebase';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Auth,
  UserCredential,
} from 'firebase/auth';

export function signInWithFireauth(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth: Auth = getAuth(FirebaseApp);
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithFireauth(
  email: string,
  password: string
): Promise<UserCredential | undefined> {
  const auth: Auth = getAuth(FirebaseApp);
  try {
    const creds: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return creds;
  } catch (err: any) {
    console.error(err.message);
    return undefined;
  }
}
