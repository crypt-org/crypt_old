export enum AccountTypes {
  USER_PASS,
  WEBSITE,
  WIFI,
  SERIAL_NUMBERS,
  PAYMENT_CARD,
  BANK_ACCOUNT,
  NOTES,
}

export interface Account {
  name: string;
  type: AccountTypes;
}

export interface UserPass extends Account {
  type: AccountTypes.USER_PASS;
  username: string;
  password: string;
}

export interface Website extends UserPass {
  url: string;
}

export interface Wifi extends Account {
  type: AccountTypes.WIFI;
  password: string;
}

export interface SerialNumbers extends Account {
  type: AccountTypes.SERIAL_NUMBERS;
  serial: string;
}

export interface PaymentCard extends Account {
  type: AccountTypes.PAYMENT_CARD;
  number: string;
  expiration: string;
  cvv: string;
  name: string;
  pin: string;
}

export interface BankAccount extends Account {
  type: AccountTypes.BANK_ACCOUNT;
  username: string;
  password: string;
}

export interface Notes extends Account {
  text: string;
}

export default interface Crypt {
  accounts: Account[];
}
