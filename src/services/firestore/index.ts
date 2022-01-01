import { FirestoreDB } from '../firebase';
import { SignUpData } from '../../routes/Auth/components/auth/logic';
import {
  doc,
  setDoc,
  addDoc,
  DocumentReference,
  DocumentData,
  collection,
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
import CryptService from '../crypt';

export async function firestoreDocCreation(
  signUpData: SignUpData,
  encryptedCrypt: string
): Promise<void> {
  await createNewUserDocument(signUpData);
  await createNewCryptDocument(signUpData, encryptedCrypt);
  await createNewRestrictedDocument(signUpData);
}

async function createNewRestrictedDocument(
  signUpData: SignUpData
): Promise<DocumentReference<DocumentData>> {
  return addDoc(collection(FirestoreDB, RESTRICTED_COLLECTION_NAME), {
    [DOCUMENT_DBVERSION_KEY]: RESTRICTED_DB_VERSION,
    [DOCUMENT_UID_KEY]: signUpData.uid,
    [DOCUMENT_PRIK_KEY]: signUpData.keyData.privKey,
  });
}

async function createNewUserDocument(
  signUpData: SignUpData
): Promise<DocumentReference<DocumentData>> {
  return addDoc(collection(FirestoreDB, USER_COLLECTION_NAME), {
    [DOCUMENT_DBVERSION_KEY]: USER_DB_VERSION,
    [DOCUMENT_UID_KEY]: signUpData.uid,
    [DOCUMENT_NAME_KEY]: signUpData.user,
    [DOCUMENT_EMAIL_KEY]: signUpData.email,
    [DOCUMENT_PUBK_KEY]: signUpData.keyData.pubKey,
    [DOCUMENT_FRIENDS_KEY]: [],
  });
}

async function createNewCryptDocument(
  signUpData: SignUpData,
  encryptedCrypt: string
): Promise<DocumentReference<DocumentData>> {
  const cryptRef: DocumentReference<DocumentData> = await addDoc(
    collection(FirestoreDB, CRYPTS_COLLECTION_NAME),
    {
      [DOCUMENT_DBVERSION_KEY]: CRYPT_DB_VERSION,
      [DOCUMENT_UID_KEY]: signUpData.uid,
      [DOCUMENT_SHAREDCREDS_KEY]: [],
    }
  );

  const encryptedArray: string[] =
    CryptService.SplitEncryptedCrypt(encryptedCrypt);

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

  return cryptRef;
}
