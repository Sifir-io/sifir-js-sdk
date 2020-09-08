export interface RegisterUserKeyParam {
  user: string;
  setFollowMeta?: boolean;
  block?: string;
}
export interface Attestation {
  attestingKeyFingerprint: string;
  attestationSigb64: string;
}
export interface KeyAttestation {
  metaId: string;
  metaValueb64: string;
  metaSignatureb64: string;
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
  keyUserTwitter = "keyUserTwitter",
  keyUserFollow = "keyUserFollow"
}
export interface KeyAttestationPayload {
  keyMetaInfo: KeyAttestationsPayload;
  keyInfo: KeyInfoPayload;
}

export interface RegisterKeyPayload {
  username: string;
  fingerprint: string;
}
export interface MetaBase {
  value: string;
  block?: string;
}
export interface LinkedMeta extends MetaBase {
  type: "url";
  sha256: string;
}
export interface ContentMeta extends MetaBase {
  type: "content";
}
export interface UploadKeyMetaTypePayloadMap {
  [KeyMetaTypes.keyUserAvatarImg]: LinkedMeta;
  [KeyMetaTypes.keyUserDisplayName]: ContentMeta;
  [KeyMetaTypes.keyUserBio]: ContentMeta;
  [KeyMetaTypes.keyUserWebsiteUrl]: ContentMeta;
  [KeyMetaTypes.keyUserEmail]: ContentMeta;
  [KeyMetaTypes.keyUserTwitter]: ContentMeta;
  [KeyMetaTypes.keyUserFollow]: ContentMeta;
}

export interface SifirIDLib {
  getNonce: () => Promise<{ nonce: string; serverArmoredPubkeyb64: string }>;
  registerUserKey: ({
    user
  }: RegisterUserKeyParam) => Promise<RegisterKeyPayload>;
  signAndUploadKeyMeta<T extends KeyMetaTypes>(
    metaKey: T,
    metaPayload: UploadKeyMetaTypePayloadMap[T]
  ): Promise<any>;
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
    limit,
    offset,
    user
  }: {
    limit?: number;
    offset?: number;
    user?: string;
  }) => Promise<KeyListEntry[]>;
}
