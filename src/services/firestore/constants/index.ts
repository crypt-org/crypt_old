export const USER_DB_VERSION: string = 'v0.1';
export const CRYPT_DB_VERSION: string = 'v0.1';
export const RESTRICTED_DB_VERSION: string = 'v0.1';

export enum FIRESTORE_COLLECTION_NAMES {
  USER = 'users',
  CRYPTS = 'crypts',
  CRYPTS_CRYPT = 'crypt',
  RESTRICTED = 'restricted',
  RESTRICTED_PRIVATE = 'private',
}

export enum FIRESTORE_DOCUMENT_NAMES {
  RESTRICTED_PRIVATE_KEY = 'key',
}

export enum FIRESTORE_DOCUMENT_PROPERTIES {
  PRIVATE_KEY = 'priv',
  PUBLIC_KEY = 'pub',
  UID = 'uid',
  DB_VERSION = 'db',
  CRYPTSPLIT = 'data',
  EMAIL = 'email',
  NAME = 'name',
  FRIENDS = 'friends',
  SHAREDCREDS = 'shared',
}

export interface Firestore_UserModel {
  [FIRESTORE_DOCUMENT_PROPERTIES.DB_VERSION]: string;
  [FIRESTORE_DOCUMENT_PROPERTIES.EMAIL]: string;
  [FIRESTORE_DOCUMENT_PROPERTIES.FRIENDS]: string[];
  [FIRESTORE_DOCUMENT_PROPERTIES.NAME]: string;
  [FIRESTORE_DOCUMENT_PROPERTIES.PUBLIC_KEY]: string;
  [FIRESTORE_DOCUMENT_PROPERTIES.UID]: string;
}
