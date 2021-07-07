import React, { useState } from "react";
import crypto from 'crypto';

function Passcode() {
  const generateKey: (password: string) => string = (password: string) => {
    const iv: Buffer = crypto.randomBytes(16);
    const salt: Buffer = crypto.randomBytes(16);
    const key: Buffer = crypto.pbkdf2Sync('1234567899', salt, 1000, 256/8, 'sha256');
    const cipherGCM: crypto.Cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    cipherGCM.write(password + '0'.repeat(password.length > 64 ? 0 : (64 - password.length)));
    cipherGCM.end();

    console.log({
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      key: key.toString('base64'),
      encrypted: cipherGCM.read().toString('base64')
    })

    return "";
  };

  const [password, passwordUpdater] = useState("");

  return (
    <div className="PasscodeGen">
      <input
        type="text"
        id="lname"
        name="lname"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          passwordUpdater(e.target.value)
        }
      />
      <input
        type="submit"
        value="Submit"
        onClick={() => generateKey(password)}
      />
    </div>
  );
}

export default Passcode;
