import UserModel from '../../models/user';

export default class Factory_User {
  static GetDefaultUser(): UserModel {
    return {
      email: '',
      name: '',
      uid: '',
      pub: '',
    };
  }

  static BuildUserModel(
    email: string,
    name: string,
    uid: string,
    pub: string
  ): UserModel {
    return {
      email: email,
      name: name,
      uid: uid,
      pub: pub,
    };
  }
}
