export interface RegisterUserKeyParam {
  user: string;
}
export interface Attestation {
  attestingKeyFingerprint: string;
  attestationSigbb64: string;
}
export interface KeyAttestation {
  metaId: string;
  metaValueb64: string;
  metaSignature64: string;
  attestations: [Attestation];
}
export interface KeyAttestationsPayload {
  fingerprint: string;
  metaDict: { [keyId: string]: KeyAttestation };
}
export interface KeyInfoPayload {
  user: string;
  fingerprint: string;
  armoredPub64: string;
}
export interface KeyListEntry {
  user: string;
  fingerprint: string;
  keyUserAvatarImgValueb64: string;
  keyUserDisplayNameValueb64: string;
  inboundKeyMetaAttestationCount: number;
  outBoundKeyMetaAttestationCount: number;
}
export enum KeyMetaTypes {
  keyUserAvatarImg = "keyUserAvatarImg",
  keyUserDisplayName = "keyUserDisplayName",
  keyUserBio = "keyUserBio",
  keyUserWebsiteUrl = "keyUserWebsiteUrl",
  keyUserEmail = "keyUserEmail",
  keyUserTwitter = "keyUserTwitter"
}
export interface KeyAttestationPayload {
  keyMetaInfo: KeyAttestationsPayload;
  keyInfo: KeyInfoPayload;
}

