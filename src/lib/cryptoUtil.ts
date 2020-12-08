import CryptoJS from "crypto-js";
import { Buffer } from "buffer";
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
export const crypto = () => {
  let hmacSHA256Hex = async (text: string, key: string) => {
      // TODO replace most of code here with this new isomorphic
      const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
      hmac.update(text);
      const hash = hmac.finalize();
      return CryptoJS.enc.Hex.stringify(hash);
    };
  /**
   * Returns a Hex encoded sha256 of the provided Buffer
   * */
  const sha256 = (buffer: Buffer): string => {
    return CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer)).toString(
      CryptoJS.enc.Hex
    );
  };

  return { hmacSHA256Hex, sha256, CryptoJS };
}
