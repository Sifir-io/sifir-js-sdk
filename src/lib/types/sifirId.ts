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
  attestations: Attestation[];
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

export interface RegisterKeyPayload {
  username: string;
  fingerprint: string;
}
export interface SifirIDLib {
  getNonce: () => Promise<{ nonce: string; serverArmoredPubkeyb64: string }>;
  registerUserKey: ({
    user
  }: RegisterUserKeyParam) => Promise<RegisterKeyPayload>;
  signAndUploadKeyMeta: (
    metaKey: string,
    metaValueb64: string
  ) => Promise<number>;
  signAndUploadKeyAvatar: (photoBase64: string) => Promise<number>;
  signAndUploadKeyDisplayName: (displayName: string) => Promise<number>;
  signAndUploadKeyBio: (bio: string) => Promise<number>;
  signAndUploadKeyWebsiteURL: (siteUrl: string) => Promise<number>;
  signAndUploadKeyEmail: (email: string) => Promise<number>;
  signAndUploadKeyTwitter: (twitterHandle: string) => Promise<number>;
  signMetaAttestation: ({
    metaId,
    metaValueb64,
    metaSignatureb64,
    attestations
  }: {
    metaId: string;
    metaValueb64: string;
    metaSignatureb64: string;
    attestations: string[];
  }) => Promise<number>;
  getKeyAttestations: (keyId: string) => Promise<KeyAttestationPayload>;
  getKeyList: ({
    limit = 10,
    offset = 0,
    user
  }: {
    limit?: number;
    offset?: number;
    user?: string;
  }) => Promise<KeyListEntry[]>;
}
