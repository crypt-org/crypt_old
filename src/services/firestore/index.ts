import { FirestoreDB } from '../firebase';
import { SignUpData } from '../../routes/Auth/components/auth/logic';
import {
  doc,
  setDoc,
  collection,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import {
  USER_DB_VERSION,
  CRYPT_DB_VERSION,
  USER_COLLECTION_NAME,
  CRYPTS_COLLECTION_NAME,
  CRYPTS_CRYPT_COLLECTION_NAME,
  RESTRICTED_COLLECTION_NAME,
} from './constants';

export function firestoreDocCreation(
  signUpData: SignUpData,
  encryptedCrypt: string
): void {
  setDoc(doc(FirestoreDB, USER_COLLECTION_NAME, signUpData.metadata.uid), {
    db: USER_DB_VERSION,
    name: signUpData.user,
    email: signUpData.email,
    pub: signUpData.metadata.pubKey,
    friends: [],
  });

  const cryptRef: DocumentReference<DocumentData> = doc(
    FirestoreDB,
    CRYPTS_COLLECTION_NAME,
    signUpData.metadata.uid
  );

  setDoc(cryptRef, {
    db: CRYPT_DB_VERSION,
  });

  const encryptedArray: string[] = splitEncryptedCryptBySize(
    5000,
    encryptedCrypt
  );

  encryptedArray.forEach((value: string, index: number) => {
    let accountsRef: DocumentReference<DocumentData> = doc(
      cryptRef,
      CRYPTS_CRYPT_COLLECTION_NAME,
      index.toString()
    );

    setDoc(accountsRef, {
      data: value,
    });
  });

  setDoc(
    doc(FirestoreDB, RESTRICTED_COLLECTION_NAME, signUpData.metadata.uid),
    {
      priv: signUpData.metadata.privKey,
    }
  );
}

function splitEncryptedCryptBySize(
  size: number,
  encryptedCrypt: string
): string[] {
  const sizeOfEncryptedCrypt: number = encryptedCrypt.length;
  const numOfChunks: number = Math.ceil(sizeOfEncryptedCrypt / size);

  let currentChunk: number = 0;
  let encryptedArray: string[] = [];

  while (currentChunk < numOfChunks) {
    encryptedArray.push(
      encryptedCrypt.substring(currentChunk * size, size * (currentChunk + 1))
    );
    currentChunk += 1;
  }

  return encryptedArray;
}
