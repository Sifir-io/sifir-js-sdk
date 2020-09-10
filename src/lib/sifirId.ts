import uuid from "uuid/v4";
import { EventEmitter } from "events";
import { pgpUtil as _pgpUtil } from "./pgpUtil";
import { crypto as _crypto } from "./cryptoUtil";
import _debug from "debug";
import agent from "superagent";
import { Buffer } from "buffer";
import {
  RegisterUserKeyParam,
  KeyMetaTypes,
  KeyListEntry,
  KeyAttestationPayload,
  RegisterKeyPayload,
  SifirIDLib,
  LinkedMeta,
  ContentMeta,
  UploadKeyMetaTypePayloadMap,
  UploadFileACL
} from "./types/sifirId";
const debug = _debug("sifirutil:");
const sifirId = ({
  pgpLib = _pgpUtil(),
  cryptoLib = _crypto(),
  idServerUrl = "https://pairing.sifir.io"
} = {}): SifirIDLib => {
  const { getPubkeyArmored, signMessage, getKeyFingerprint } = pgpLib;
  const getNonce = async () => {
    const {
      body: { serverArmoredPubkeyb64, nonce }
    } = await agent.get(`${idServerUrl}/auth/`);
    return { nonce, serverArmoredPubkeyb64 };
  };
  const registerUserKey = async ({
    user,
    block,
    setFollowMeta = true
  }: RegisterUserKeyParam): Promise<RegisterKeyPayload> => {
    // Request user from id server
    // get nonce
    const { nonce, serverArmoredPubkeyb64 } = await getNonce();
    const serverArmoredPubkey = Buffer.from(
      serverArmoredPubkeyb64,
      "base64"
    ).toString("utf8");

    const fingerprint = await getKeyFingerprint();
    // sign and encrypt payload with serverkey
    const payload = { nonce, username: user, keyId: fingerprint };
    const { armoredSignature } = await signMessage({
      msg: JSON.stringify(payload)
    });

    // send it off to get user nad pass
    const { body } = await agent.post(`${idServerUrl}/auth/register/`).send({
      ...payload,
      pubkeyArmoredb64: Buffer.from(await getPubkeyArmored(), "utf8").toString(
        "base64"
      ),
      signatureb64: Buffer.from(armoredSignature, "utf8").toString("base64")
    });

    // Set the follow meta tag
    if (setFollowMeta) {
      await signAndUploadKeyMeta(KeyMetaTypes.keyUserFollow, {
        value: fingerprint,
        type: "content",
        block: block ? block : undefined
      });
    }
    return body;
  };
  /** @TODO For now onus is on caller to provide Block + Md5 of link , will pprobably refactor this */
  const signAndUploadKeyMeta = async <T extends KeyMetaTypes>(
    metaKey: T,
    metaPayload: UploadKeyMetaTypePayloadMap[T]
  ): Promise<any> => {
    const keyId = await getKeyFingerprint();
    const metaValueb64 = Buffer.from(JSON.stringify(metaPayload)).toString(
      "base64"
    );
    const { armoredSignature } = await signMessage({
      msg: metaValueb64
    });
    const { body } = await agent.post(`${idServerUrl}/keys/meta`).send({
      metaKey,
      metaValueb64,
      signatureb64: Buffer.from(armoredSignature).toString("base64"),
      keyId
    });
    return body;
  };
  /**
   * @deprecated
   * use signAndUploadKeyMeta directly
  const signAndUploadKeyAvatar = async (
    photoBase64: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      KeyMetaTypes.keyUserAvatarImg,
      { type: "url", value: "FIXME URLphotoBase64", sha256: "" }
    );
    return metaId;
  };
  /**
   * @deprecated
   * use signAndUploadKeyMeta directly
  const signAndUploadKeyDisplayName = async (
    displayName: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      KeyMetaTypes.keyUserDisplayName,
      { type: "content", value: displayName }
    );
    return metaId;
  };
  /**
   * @deprecated
  const signAndUploadKeyBio = async (bio: string): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(KeyMetaTypes.keyUserBio, {
      type: "content",
      value: bio
    });
    return metaId;
  };
  //FIXME replace all these functions with signAndUploadLinkedMeta , and signAndUploadMetaContent
  /**
   * @deprecated
   * use signAndUploadKeyMeta directly
  const signAndUploadKeyWebsiteURL = async (
    siteUrl: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      KeyMetaTypes.keyUserWebsiteUrl,
      Buffer.from(siteUrl).toString("base64")
    );
    return metaId;
  };
  /**
   * @deprecated
   * use signAndUploadKeyMeta directly
  const signAndUploadKeyEmail = async (email: string): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      KeyMetaTypes.keyUserEmail,
      Buffer.from(email).toString("base64")
    );
    return metaId;
  };
  /**
   * @deprecated
   * use signAndUploadKeyMeta directly
  const signAndUploadKeyTwitter = async (
    twitterHandle: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      KeyMetaTypes.keyUserTwitter,
      Buffer.from(twitterHandle).toString("base64")
    );
    return metaId;
  };
  */
  const signMetaAttestation = async ({
    metaId,
    metaValueb64,
    metaSignatureb64,
    attestations // FIXME ... do we sign this
  }: {
    metaId: string;
    metaValueb64: string;
    metaSignatureb64: string;
    attestations: string[];
  }): Promise<number> => {
    const { armoredSignature } = await signMessage({
      msg: metaSignatureb64
    });
    const attestingPayload = {
      metaId,
      metaSignatureb64,
      signatureb64: Buffer.from(armoredSignature).toString("base64"),
      keyId: await getKeyFingerprint()
    };
    const { body } = await agent
      .post(`${idServerUrl}/keys/meta/${metaId}/attest`)
      .send(attestingPayload);
    return body.attestationId;
  };
  const getKeyAttestations = async (
    keyId: string
  ): Promise<KeyAttestationPayload> => {
    const { body } = await agent.get(`${idServerUrl}/keys/${keyId}`);
    const { keyMetaInfo, keyInfo } = body;
    return { keyMetaInfo, keyInfo };
  };
  const getKeyList = async ({
    limit = 10,
    offset = 0,
    user
  }: {
    limit?: number;
    offset?: number;
    user?: string;
  }): Promise<KeyListEntry[]> => {
    const {
      body: { keys }
    } = await agent.get(`${idServerUrl}/keys`).query({ limit, offset, user });
    return keys;
  };

  const signAndUploadFile = async ({
    file,
    filename
  }: {
    file: Buffer;
    filename: string;
  }): Promise<{ fileUrl: string; acl: UploadFileACL }> => {
    if (!filename) throw "uploadSingedFile with no filename";
    const fileSha256 = cryptoLib.sha256(file);
    const { armoredSignature } = await pgpLib.signMessage({ msg: fileSha256 });
    const sha256Sigb64 = Buffer.from(armoredSignature).toString("base64");
    const { body } = await agent
      .post(`${idServerUrl}/keys/meta/upload`)
      // note: order is very important, body before attachment to able to verify data
      .field("nonce", (await getNonce()).nonce)
      .field("sha256", fileSha256)
      .field("sha256Signatureb64", sha256Sigb64)
      .field("keyId", await pgpLib.getKeyFingerprint())
      .attach("upload", file, filename);
    return body;
  };
  return {
    signAndUploadKeyMeta,
    registerUserKey,
    getNonce,
    signMetaAttestation,
    getKeyList,
    getKeyAttestations,
    signAndUploadFile
  };
};
export { sifirId };
