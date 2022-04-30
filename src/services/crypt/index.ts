import { CRYPT_SPLIT_SIZE_BYTES } from './constants';
import CryptModel from '../../models/crypt';

export default class CryptService {
  static GetNewCrypt(): CryptModel {
    return {
      accounts: [],
    } as CryptModel;
  }

  static RebuildCrypt(cryptString: string): CryptModel {
    return JSON.parse(cryptString);
  }

  static ConvertCryptToString(crypt: CryptModel): string {
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
