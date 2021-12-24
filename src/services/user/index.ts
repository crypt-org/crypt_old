import User from './constants';

export default class Factory_UserState {
  static GetDefaultUser(): User {
    return {
      email: '',
      name: '',
      uid: '',
      pub: '',
      priv: '',
    };
  }

  static BuildUserState(
    email: string,
    name: string,
    uid: string,
    pub: string,
    priv: string
  ): User {
    return {
      email: email,
      name: name,
      uid: uid,
      pub: pub,
      priv: priv,
    };
  }
}
