import Crypt, { CRYPT_SPLIT_SIZE_BYTES } from './constants';

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

  static SplitEncryptedCrypt(
    encryptedCrypt: string,
    size: number = CRYPT_SPLIT_SIZE_BYTES
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
}
