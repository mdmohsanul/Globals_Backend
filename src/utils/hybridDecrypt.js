
import crypto from "crypto";
import fs from "fs";

const privateKey = fs.readFileSync("private.pem", "utf8");

export const decryptHybrid = (encryptedKeyB64, encryptedDataB64, ivB64) => {
  // 1️⃣ RSA-OAEP decrypt AES key
  const encryptedKeyBuf = Buffer.from(encryptedKeyB64, "base64");

  const aesKeyBuf = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedKeyBuf
  );

  // 2️⃣ Decode AES-GCM data
  const iv = Buffer.from(ivB64, "base64");
  const encBuf = Buffer.from(encryptedDataB64, "base64");

  // last 16 bytes = auth tag
  const tag = encBuf.subarray(encBuf.length - 16);
  const ciphertext = encBuf.subarray(0, encBuf.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKeyBuf, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  const jsonString = decrypted.toString("utf8");
  return JSON.parse(jsonString);
};
