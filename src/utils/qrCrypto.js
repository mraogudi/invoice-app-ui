import CryptoJS from "crypto-js";
import LZString from "lz-string";

const SECRET = "invoice-secure-key-2026";

/* Encrypt + Compress */
export function encryptInvoiceData(data) {
  const json = JSON.stringify(data);

  const compressed = LZString.compressToUTF16(json);

  const encrypted = CryptoJS.AES.encrypt(compressed, SECRET).toString();

  return encrypted;
}

/* Decrypt + Decompress */
export function decryptInvoiceData(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  const decompressed = LZString.decompressFromUTF16(decrypted);

  return JSON.parse(decompressed);
}
