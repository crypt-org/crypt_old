import { FirestoreDB } from '../firebase';
import {
  doc,
  setDoc,
  addDoc,
  DocumentReference,
  DocumentData,
  collection,
  query,
  where,
  Query,
  getDocs,
  QuerySnapshot,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  USER_DB_VERSION,
  CRYPT_DB_VERSION,
  RESTRICTED_DB_VERSION,
  Firestore_UserModel,
  FIRESTORE_DOCUMENT_PROPERTIES,
  FIRESTORE_COLLECTION_NAMES,
  FIRESTORE_DOCUMENT_NAMES,
} from './constants';
import CryptService from '../crypt';
import { KeyData, LoginData } from '../../routes/Auth/components/auth/logic';

export async function firestoreDocCreation(
  signUpData: LoginData & KeyData,
  encryptedCrypt: string
): Promise<void> {
  await createNewUserDocument(signUpData);
  await createNewCryptDocument(signUpData, encryptedCrypt);
  await createNewRestrictedDocument(signUpData);
}

async function createNewRestrictedDocument(
  signUpData: LoginData & KeyData
): Promise<DocumentReference<DocumentData>> {
  const restricted_ref: DocumentReference<DocumentData> = await addDoc(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.RESTRICTED),
    {
      [FIRESTORE_DOCUMENT_PROPERTIES.DB_VERSION]: RESTRICTED_DB_VERSION,
      [FIRESTORE_DOCUMENT_PROPERTIES.UID]: signUpData.uid,
    }
  );
  await setDoc(
    doc(
      restricted_ref,
      FIRESTORE_COLLECTION_NAMES.RESTRICTED_PRIVATE,
      FIRESTORE_DOCUMENT_NAMES.RESTRICTED_PRIVATE_KEY
    ),
    {
      [FIRESTORE_DOCUMENT_PROPERTIES.PRIVATE_KEY]: signUpData.priv,
    }
  );
  return restricted_ref;
}

async function createNewUserDocument(
  signUpData: LoginData & KeyData
): Promise<DocumentReference<DocumentData>> {
  const new_user_data: Firestore_UserModel = {
    [FIRESTORE_DOCUMENT_PROPERTIES.DB_VERSION]: USER_DB_VERSION,
    [FIRESTORE_DOCUMENT_PROPERTIES.UID]: signUpData.uid,
    [FIRESTORE_DOCUMENT_PROPERTIES.NAME]: signUpData.name,
    [FIRESTORE_DOCUMENT_PROPERTIES.EMAIL]: signUpData.email,
    [FIRESTORE_DOCUMENT_PROPERTIES.PUBLIC_KEY]: signUpData.pub,
    [FIRESTORE_DOCUMENT_PROPERTIES.FRIENDS]: [],
  };
  return addDoc(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.USER),
    new_user_data
  );
}

async function createNewCryptDocument(
  signUpData: LoginData & KeyData,
  encryptedCrypt: string
): Promise<DocumentReference<DocumentData>> {
  const cryptRef: DocumentReference<DocumentData> = await addDoc(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.CRYPTS),
    {
      [FIRESTORE_DOCUMENT_PROPERTIES.DB_VERSION]: CRYPT_DB_VERSION,
      [FIRESTORE_DOCUMENT_PROPERTIES.UID]: signUpData.uid,
      [FIRESTORE_DOCUMENT_PROPERTIES.SHAREDCREDS]: [],
    }
  );

  const encryptedArray: string[] =
    CryptService.SplitEncryptedCrypt(encryptedCrypt);

  encryptedArray.forEach((value: string, index: number) => {
    let accountsRef: DocumentReference<DocumentData> = doc(
      cryptRef,
      FIRESTORE_COLLECTION_NAMES.CRYPTS_CRYPT,
      index.toString()
    );

    setDoc(accountsRef, {
      [FIRESTORE_DOCUMENT_PROPERTIES.CRYPTSPLIT]: value,
    });
  });

  return cryptRef;
}

export async function getRestrictedDocument(uid: string) {
  const res_doc_query: Query<DocumentData> = query(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.RESTRICTED),
    where(FIRESTORE_DOCUMENT_PROPERTIES.UID, '==', uid)
  );

  const query_snapshot: QuerySnapshot<DocumentData> = await getDocs(
    res_doc_query
  );
  if (query_snapshot.size === 0 || query_snapshot.size > 1) {
    console.error('Restricted Document Fetch Failed.');
    return undefined;
  }
  return query_snapshot.docs[0].ref;
}

export async function getPrivateKeyDocumentData(uid: string) {
  const restricted_ref: DocumentReference<DocumentData> | undefined =
    await getRestrictedDocument(uid);
  if (!restricted_ref) {
    console.error('Private Document Fetch Failed.');
    return undefined;
  }

  const pk_ref: DocumentData | undefined = (
    await getDoc(
      doc(
        restricted_ref,
        FIRESTORE_COLLECTION_NAMES.RESTRICTED_PRIVATE,
        FIRESTORE_DOCUMENT_NAMES.RESTRICTED_PRIVATE_KEY
      )
    )
  ).data();
  return pk_ref;
}

export async function getUserData(
  uid: string
): Promise<Firestore_UserModel | undefined> {
  const user_data_query: Query<DocumentData> = query(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.USER),
    where(FIRESTORE_DOCUMENT_PROPERTIES.UID, '==', uid)
  );
  const query_snapshot: QuerySnapshot<DocumentData> = await getDocs(
    user_data_query
  );
  if (query_snapshot.size === 0 || query_snapshot.size > 1) {
    console.error('User Document Fetch Failed.');
    return undefined;
  }
  return query_snapshot.docs[0].data() as Firestore_UserModel;
}

export async function getEncryptedPrivateKey(uid: string) {
  const pk_doc_data: DocumentData | undefined = await getPrivateKeyDocumentData(
    uid
  );
  return pk_doc_data
    ? pk_doc_data[FIRESTORE_DOCUMENT_PROPERTIES.PRIVATE_KEY]
    : pk_doc_data;
}

export async function getCryptDocument(
  uid: string
): Promise<DocumentReference<DocumentData> | undefined> {
  const crypt_doc_query: Query<DocumentData> = query(
    collection(FirestoreDB, FIRESTORE_COLLECTION_NAMES.CRYPTS),
    where(FIRESTORE_DOCUMENT_PROPERTIES.UID, '==', uid)
  );
  const query_snapshot: QuerySnapshot<DocumentData> = await getDocs(
    crypt_doc_query
  );
  if (query_snapshot.size === 0) {
    return undefined;
  }
  return query_snapshot.docs[0].ref;
}

export async function getEncryptedCryptDocuments(
  uid: string
): Promise<QueryDocumentSnapshot<DocumentData>[] | undefined> {
  const crypt_parent_doc_ref: DocumentReference<DocumentData> | undefined =
    await getCryptDocument(uid);
  if (!crypt_parent_doc_ref) {
    return undefined;
  }

  const crypt_docs_coll: QuerySnapshot<DocumentData> = await getDocs(
    collection(
      FirestoreDB,
      crypt_parent_doc_ref.path,
      FIRESTORE_COLLECTION_NAMES.CRYPTS_CRYPT
    )
  );
  return crypt_docs_coll.docs;
}

export async function getEncryptedCrypt(
  uid: string
): Promise<string | undefined> {
  const crypt_docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    await getEncryptedCryptDocuments(uid);
  if (!crypt_docs) {
    return undefined;
  }
  const split_crypts: string[] = [];
  crypt_docs.forEach((snapshot: QueryDocumentSnapshot<DocumentData>) => {
    split_crypts.push(
      snapshot.data()[FIRESTORE_DOCUMENT_PROPERTIES.CRYPTSPLIT]
    );
  });
  return split_crypts.join();
}
