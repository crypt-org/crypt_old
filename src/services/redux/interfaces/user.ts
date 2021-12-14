export default interface User {
  email: string;
  name: string;
  uid: string;
  pub: string;
  priv: string;
}

export class Factory_UserState {
  static ResetUserState(): User {
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
