import uuid from "uuid/v4";
import { EventEmitter } from "events";
import { pgpUtil as _pgpUtil, SifirPgpUtil } from "./pgpUtil";
import _debug from "debug";
import agent from "superagent";
const debug = _debug("sifirutil:");
// Only needed for sifir matrix service
interface RegisterUserKeyParam {
  user: string;
}
interface Attestation {
  attestingKeyFingerprint: string;
  attestationSigbb64: string;
}
interface KeyAttestation {
  metaId: string;
  metaValueb64: string;
  metaSignature64: string;
  attestations: [Attestation];
}
interface KeyAttestationsPayload {
  fingerprint: string;
  metaDict: { [keyId: string]: KeyAttestation };
}
interface KeyInfoPayload {
  user: string;
  fingerprint: string;
  armoredPub64: string;
}
const sifirId = ({
  pgpLib = _pgpUtil(),
  idServerUrl = "https://pairing.sifir.io"
} = {}) => {
  const { getPubkeyArmored, signMessage, getKeyFingerprint } = pgpLib;
  const getNonce = async () => {
    const {
      body: { serverArmoredPubkeyb64, nonce }
    } = await agent.get(`${idServerUrl}/auth/`);
    return { nonce, serverArmoredPubkeyb64 };
  };
  const registerUserKey = async ({ user }: RegisterUserKeyParam) => {
    // Request user from id server
    // get nonce
    const { nonce, serverArmoredPubkeyb64 } = await getNonce();
    const serverArmoredPubkey = Buffer.from(
      serverArmoredPubkeyb64,
      "base64"
    ).toString("utf8");

    try {
      const fingerprint = await getKeyFingerprint();
      // sign and encrypt payload with serverkey
      const payload = { nonce, username: user, keyId: fingerprint };
      const { armoredSignature } = await signMessage({
        msg: JSON.stringify(payload)
      });

      // send it off to get user nad pass
      const { body } = await agent.post(`${idServerUrl}/auth/register/`).send({
        ...payload,
        pubkeyArmoredb64: Buffer.from(
          await getPubkeyArmored(),
          "utf8"
        ).toString("base64"),
        signatureb64: Buffer.from(armoredSignature, "utf8").toString("base64")
      });
      return body;
    } catch (err) {
      const {
        status,
        response: { text }
      } = err;
      debug("error setting node user", status, text);
    }
  };

  const signAndUploadKeyMeta = async (
    metaKey: string,
    metaValueb64: string
  ) => {
    const keyId = await getKeyFingerprint();
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
  const signAndUploadKeyAvatar = async (
    photoBase64: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserAvatarImg",
      photoBase64
    );
    return metaId;
  };
  const signAndUploadKeyDisplayName = async (
    displayName: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserDisplayName",
      Buffer.from(displayName).toString("base64")
    );
    return metaId;
  };
  const signAndUploadKeyBio = async (bio: string): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserBio",
      Buffer.from(bio).toString("base64")
    );
    return metaId;
  };

  const signAndUploadKeyWebsiteURL = async (
    siteUrl: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserWebsiteUrl",
      Buffer.from(siteUrl).toString("base64")
    );
    return metaId;
  };
  const signAndUploadKeyEmail = async (email: string): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserEmail",
      Buffer.from(email).toString("base64")
    );
    return metaId;
  };
  const signAndUploadKeyTwitter = async (
    twitterHandle: string
  ): Promise<number> => {
    const { metaId } = await signAndUploadKeyMeta(
      "keyUserTwitter",
      Buffer.from(twitterHandle).toString("base64")
    );
    return metaId;
  };
  const signMetaAttestation = async ({
    metaId,
    metaValueb64,
    metaSignatureb64,
    attestations // FIXME ... do we sign this
  }: {
    metaId: string;
    metaValueb64: string;
    metaSignatureb64: string;
    attestations: [string];
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
  // TODO export this, ADD email, twitter, bio and website fns to lib
  const getKeyAttestations = async (
    keyId: string
  ): Promise<{
    keyMetaInfo: KeyAttestationsPayload;
    keyInfo: KeyInfoPayload;
  }> => {
    const { body } = await agent.get(`${idServerUrl}/keys/${keyId}`);
    const { keyMetaInfo, keyInfo } = body;
    return { keyMetaInfo, keyInfo };
  };
  const getKeyList = async ({
    limit = 10,
    offset = 0,
    user
  }: {
    limit: number;
    offset: number;
    user: string;
  }): Promise<[{ user: string; fingerprint: string }]> => {
    const {
      body: { keys }
    } = await agent.get(`${idServerUrl}/keys`).query({ limit, offset, user });
    return keys;
  };
  return {
    registerUserKey,
    getNonce,
    signAndUploadKeyAvatar,
    signAndUploadKeyDisplayName,
    signMetaAttestation,
    signAndUploadKeyBio,
    signAndUploadKeyWebsiteURL,
    signAndUploadKeyEmail,
    signAndUploadKeyTwitter,
    getKeyList,
    getKeyAttestations
  };
};
export { sifirId };
