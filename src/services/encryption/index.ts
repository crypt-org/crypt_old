import forge, { pki } from 'node-forge';
import { KeyData } from '../../routes/Auth/components/auth/logic';
import CryptService from '../crypt';
import CryptModel from '../../models/crypt';

export default class EncryptionService {
  static GenerateRSAKeysWithPassword(
    password: string,
    onKeyGenerationComplete: (generatedKeyData: KeyData) => void
  ): void {
    const rsa: typeof pki.rsa = forge.pki.rsa;
    rsa.generateKeyPair(
      { bits: 2048, workers: 2 },
      function (err: Error, keypair: pki.rsa.KeyPair) {
        if (err) {
          console.error(err);
          return;
        }
        const pki: typeof forge.pki = forge.pki;
        const encPri: string = pki.encryptRsaPrivateKey(
          keypair.privateKey,
          password,
          {
            algorithm: 'aes256',
          }
        );
        const pub: string = pki.publicKeyToPem(keypair.publicKey);
        onKeyGenerationComplete({
          pub: pub,
          priv: encPri,
        });
      }
    );
  }

  static EncryptCrpyt(publicKey: string, crypt: CryptModel): string {
    const pki: typeof forge.pki = forge.pki;
    const pk: pki.rsa.PublicKey = pki.publicKeyFromPem(publicKey);
    return btoa(
      pk.encrypt(CryptService.ConvertCryptToString(crypt), 'RSA-OAEP')
    );
  }

  static DecryptCrypt(
    privateKey: pki.rsa.PrivateKey,
    encryptedCrypt: string
  ): CryptModel {
    return CryptService.RebuildCrypt(
      privateKey.decrypt(atob(encryptedCrypt), 'RSA-OAEP')
    );
  }

  static DecryptRSAPrivateKey(
    password: string,
    encryptedPrivateKey: string
  ): pki.rsa.PrivateKey {
    return forge.pki.decryptRsaPrivateKey(encryptedPrivateKey, password);
  }
}
