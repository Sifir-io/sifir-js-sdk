export interface SignMessageWithArmoredKeyParam {
  msg: string;
  privkeyArmored: string;
  passphrase: string;
}
export interface SignMessageWithArmoredKeyPayload {
  armoredSignature: string;
  message: string;
}
export interface EncryptMessagePayload {
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
  getKeyInfo(
    armoredKey: string,
    passphrase?: string
  ): Promise<{
    pubkeyArmored: string;
    fingerprint: string;
    hexkeyId: string;
    isPrivate: boolean;
    isLocked: boolean;
    isExpired: boolean;
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
  verifySignedMessage({
    msg,
    armoredSignature,
    armoredKey
  }: {
    msg: string;
    armoredSignature: string;
    armoredKey: string;
  }): Promise<boolean>;
  decryptMessage(msg: string): Promise<string>;
}
