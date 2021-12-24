import { FirestoreDB } from '../firebase';
import { SignUpData } from '../../routes/Auth/components/auth/logic';
import {
  doc,
  setDoc,
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
  DOCUMENT_PRIK_KEY,
  DOCUMENT_DBVERSION_KEY,
  DOCUMENT_NAME_KEY,
  DOCUMENT_EMAIL_KEY,
  DOCUMENT_PUBK_KEY,
  DOCUMENT_FRIENDS_KEY,
  DOCUMENT_CRYPTSPLIT_KEY,
  DOCUMENT_UID_KEY,
  RESTRICTED_DB_VERSION,
  DOCUMENT_SHAREDCREDS_KEY,
} from './constants';

export function firestoreDocCreation(
  signUpData: SignUpData,
  encryptedCrypt: string
): void {
  setDoc(doc(FirestoreDB, USER_COLLECTION_NAME, signUpData.uid), {
    [DOCUMENT_DBVERSION_KEY]: USER_DB_VERSION,
    [DOCUMENT_NAME_KEY]: signUpData.user,
    [DOCUMENT_EMAIL_KEY]: signUpData.email,
    [DOCUMENT_PUBK_KEY]: signUpData.keyData.pubKey,
    [DOCUMENT_FRIENDS_KEY]: [],
  });

  const cryptRef: DocumentReference<DocumentData> = doc(
    FirestoreDB,
    CRYPTS_COLLECTION_NAME,
    signUpData.uid
  );

  setDoc(cryptRef, {
    [DOCUMENT_DBVERSION_KEY]: CRYPT_DB_VERSION,
    [DOCUMENT_SHAREDCREDS_KEY]: [],
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
      [DOCUMENT_CRYPTSPLIT_KEY]: value,
    });
  });

  setDoc(doc(FirestoreDB, RESTRICTED_COLLECTION_NAME, signUpData.uid), {
    [DOCUMENT_DBVERSION_KEY]: RESTRICTED_DB_VERSION,
    [DOCUMENT_PRIK_KEY]: signUpData.keyData.privKey,
  });
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
