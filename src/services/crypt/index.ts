import Crypt from './constants';

export default class CryptService {
  static GetNewCrypt(): Crypt {
    return {
      accounts: [],
    } as Crypt;
  }

  static RebuildCrypt(cryptString: string): Crypt {
    return JSON.parse(cryptString);
  }

  static ConvertCryptToString(crypt: Crypt): string {
    return JSON.stringify(crypt);
  }
}
