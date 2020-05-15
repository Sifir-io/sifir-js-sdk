import _debug from "debug";
import * as _pgp from "openpgp";
/// TODO move to .d.ts file
interface SignMessageWithArmoredKeyParam {
  msg: string;
  privkeyArmored: string;
  passphrase: string;
}
interface SignMessageWithArmoredKeyPayload {
  armoredSignature: string;
  message: string;
}
interface EncryptMessagePayload {
  msg: string;
  pubkey: string;
}
export interface SifirPgpUtil {
  getPubkeyArmored(): string;
  signMessageWithArmoredKey(
    param: SignMessageWithArmoredKeyParam
  ): Promise<SignMessageWithArmoredKeyPayload>;
  signMessage({
    msg
  }: {
    msg: string;
  }): Promise<SignMessageWithArmoredKeyPayload>;
  // getFingerprintFromArmoredKey(armoredkey: string): Promise<string>;
  encryptMessage({
    msg,
    pubkey
  }: EncryptMessagePayload): Promise<{
    armoredSignature: string;
    armoredEncryptedMsg: string;
  }>;
  getKeyFingerprint({
    armoredkey,
    encoding
  }: {
    armoredkey?: string;
    encoding?: "hex" | "utf8";
  }): Promise<string>;
  makeNewPgpKey({
    passphrase,
    email,
    user
  }: {
    passphrase: string;
    email?: string;
    user?: string;
  }): Promise<{
    privkeyArmored: string;
    pubkeyArmored: string;
    revocationCertificate: string;
  }>;
  initAndUnlockKeys({
    privkeyArmored,
    passphrase
  }: {
    privkeyArmored: string;
    passphrase: string;
  }): Promise<{ pubkeyArmored: string; fingerprint: string; hexkeyId: string }>;
}
const pgpUtil = ({
  pgp = _pgp,
  debug = _debug("sifir:pgputil:")
} = {}): SifirPgpUtil => {
  let decryptedPrivkeyObj: any, pubkeyArmored: string;
  const _getPrimarykeyFromArmored = async (armoredKey: string) => {
    const foundKeys = await pgp.key.readArmored(armoredKey);
    const {
      keys: [primaryKey]
    } = foundKeys;
    return primaryKey;
  };
  const _getDecryptedPrivateKeyFromArmored = async (
    armoredPrivatekey: string,
    passphrase: string
  ) => {
    const {
      keys: [privateKey]
    } = await pgp.key.readArmored(armoredPrivatekey);
    await privateKey.decrypt(passphrase);
    return privateKey;
  };
  const makeNewPgpKey = async ({
    passphrase,
    email,
    user
  }: {
    passphrase: string;
    email?: string;
    user?: string;
  }): Promise<{
    privkeyArmored: string;
    pubkeyArmored: string;
    revocationCertificate: string;
  }> => {
    const {
      privateKeyArmored,
      publicKeyArmored,
      revocationCertificate
    } = await pgp.generateKey({
      userIds: [{ name: user, email: email ? email : undefined }],
      curve: "ed25519", // ECC curve name
      passphrase
    });
    return {
      privkeyArmored: privateKeyArmored,
      pubkeyArmored: publicKeyArmored,
      revocationCertificate
    };
  };

  const initAndUnlockKeys = async ({
    privkeyArmored,
    passphrase
  }: {
    privkeyArmored: string;
    passphrase: string;
  }): Promise<{
    pubkeyArmored: string;
    fingerprint: string;
    hexkeyId: string;
  }> => {
    if (!privkeyArmored || !passphrase) {
      throw "Missing key and pass";
    }
    decryptedPrivkeyObj = await _getDecryptedPrivateKeyFromArmored(
      privkeyArmored,
      passphrase
    );
    return {
      pubkeyArmored: decryptedPrivkeyObj.toPublic().armor(),
      fingerprint: decryptedPrivkeyObj.keyPacket.getFingerprint(),
      hexkeyId: Buffer.from(
        decryptedPrivkeyObj.keyPacket.getKeyId().bytes
      ).toString("hex")
    };
  };

  const getPubkeyArmored = () => {
    if (!decryptedPrivkeyObj) throw "Key not init";
    return decryptedPrivkeyObj.toPublic().armor();
  };

  const signMessage = async ({
    msg
  }: {
    msg: string;
  }): Promise<SignMessageWithArmoredKeyPayload> => {
    if (!decryptedPrivkeyObj) throw "Key not init";
    const { signature: armoredSignature } = await pgp.sign({
      message: await pgp.cleartext.fromText(msg),
      privateKeys: [await decryptedPrivkeyObj],
      detached: true
    });
    return { armoredSignature, message: msg };
  };

  const signMessageWithArmoredKey = async ({
    msg,
    privkeyArmored,
    passphrase
  }: SignMessageWithArmoredKeyParam): Promise<
    SignMessageWithArmoredKeyPayload
  > => {
    const privKeyToSign = await _getDecryptedPrivateKeyFromArmored(
      privkeyArmored,
      passphrase
    );
    const { signature: armoredSignature } = await pgp.sign({
      message: await pgp.cleartext.fromText(msg),
      privateKeys: [privKeyToSign],
      detached: true
    });
    return { armoredSignature, message: msg };
  };
  //const getFingerprintFromArmoredKey = async (armoredkey: string) => {
  //  const {
  //    primaryKey: { fingerprint }
  //  } = await _getPrimarykeyFromArmored(armoredkey);
  //  return Buffer.from(fingerprint)
  //    .toString("hex")
  //    .toUpperCase();
  //};
  const getKeyFingerprint = async ({
    armoredkey = undefined,
    encoding = "utf8"
  }: {
    armoredkey?: string;
    encoding?: "hex" | "utf8";
  } = {}) => {
    let fingerprint;
    if (!armoredkey) {
      if (!decryptedPrivkeyObj) throw "Key not init";
      fingerprint = decryptedPrivkeyObj.keyPacket.getFingerprint();
    } else {
      const { primaryKey } = await _getPrimarykeyFromArmored(armoredkey);
      fingerprint = primaryKey.fingerprint;
    }
    return Buffer.from(fingerprint).toString(encoding);
  };
  const encryptMessage = async ({ msg, pubkey }: EncryptMessagePayload) => {
    if (!decryptedPrivkeyObj) throw "Key not init";
    const result = await pgp.encrypt({
      message: pgp.message.fromText(msg), // input as Message object
      publicKeys: pubkey,
      privateKeys: [decryptedPrivkeyObj] // for signing (optional)
    });
    const { data: armoredEncryptedMsg, signature: armoredSignature } = result;
    return { armoredSignature, armoredEncryptedMsg };
  };

  /**
   *  @param email
   *  @param passphrase
   *  @returns {Promise<{pubkeyArmored:string,fingerprint:string,hexkeyId:string}>}
   **/
  return {
    // getFingerprintFromArmoredKey,
    signMessageWithArmoredKey,
    signMessage,
    encryptMessage,
    getKeyFingerprint,
    getPubkeyArmored,
    makeNewPgpKey,
    initAndUnlockKeys
  };
};
export { pgpUtil };
