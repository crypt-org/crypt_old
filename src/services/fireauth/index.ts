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

export function signUpWithFireauth(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth: Auth = getAuth(FirebaseApp);
  return createUserWithEmailAndPassword(auth, email, password);
}
