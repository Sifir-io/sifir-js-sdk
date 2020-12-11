"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sifirId = void 0;
const pgpUtil_1 = require("./pgpUtil");
const cryptoUtil_1 = require("./cryptoUtil");
const debug_1 = __importDefault(require("debug"));
const superagent_1 = __importDefault(require("superagent"));
const buffer_1 = require("buffer");
const sifirId_1 = require("./types/sifirId");
const debug = debug_1.default("sifirutil:");
const sifirId = ({ pgpLib = pgpUtil_1.pgpUtil(), cryptoLib = cryptoUtil_1.crypto(), idServerUrl = "https://pairing.sifir.io" } = {}) => {
    const { getPubkeyArmored, signMessage, getKeyFingerprint } = pgpLib;
    const getNonce = async () => {
        const { body: { serverArmoredPubkeyb64, nonce } } = await superagent_1.default.get(`${idServerUrl}/auth/`);
        return { nonce, serverArmoredPubkeyb64 };
    };
    const registerUserKey = async ({ user, block, setFollowMeta = true }) => {
        // Request user from id server
        // get nonce
        const { nonce, serverArmoredPubkeyb64 } = await getNonce();
        const serverArmoredPubkey = buffer_1.Buffer.from(serverArmoredPubkeyb64, "base64").toString("utf8");
        const fingerprint = await getKeyFingerprint();
        // sign and encrypt payload with serverkey
        const payload = { nonce, username: user, keyId: fingerprint };
        const { armoredSignature } = await signMessage({
            msg: JSON.stringify(payload)
        });
        // send it off to get user nad pass
        const { body } = await superagent_1.default.post(`${idServerUrl}/auth/register/`).send({
            ...payload,
            pubkeyArmoredb64: buffer_1.Buffer.from(await getPubkeyArmored(), "utf8").toString("base64"),
            signatureb64: buffer_1.Buffer.from(armoredSignature, "utf8").toString("base64")
        });
        // Set the follow meta tag
        if (setFollowMeta) {
            await signAndUploadKeyMeta(sifirId_1.KeyMetaTypes.keyUserFollow, {
                value: fingerprint,
                type: "content",
                block: block ? block : undefined
            });
        }
        return body;
    };
    /** @TODO For now onus is on caller to provide Block + Md5 of link , will pprobably refactor this */
    const signAndUploadKeyMeta = async (metaKey, metaPayload) => {
        const keyId = await getKeyFingerprint();
        const metaValueb64 = buffer_1.Buffer.from(JSON.stringify(metaPayload)).toString("base64");
        const { armoredSignature } = await signMessage({
            msg: metaValueb64
        });
        const { body } = await superagent_1.default.post(`${idServerUrl}/keys/meta`).send({
            metaKey,
            metaValueb64,
            signatureb64: buffer_1.Buffer.from(armoredSignature).toString("base64"),
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
    const signMetaAttestation = async ({ metaId, metaValueb64, metaSignatureb64, attestations // FIXME ... do we sign this
     }) => {
        const { armoredSignature } = await signMessage({
            msg: metaSignatureb64
        });
        const attestingPayload = {
            metaId,
            metaSignatureb64,
            signatureb64: buffer_1.Buffer.from(armoredSignature).toString("base64"),
            keyId: await getKeyFingerprint()
        };
        const { body } = await superagent_1.default
            .post(`${idServerUrl}/keys/meta/${metaId}/attest`)
            .send(attestingPayload);
        return body.attestationId;
    };
    const getKeyAttestations = async (keyId) => {
        const { body } = await superagent_1.default.get(`${idServerUrl}/keys/${keyId}`);
        const { keyMetaInfo, keyInfo } = body;
        return { keyMetaInfo, keyInfo };
    };
    const getKeyList = async ({ limit = 10, offset = 0, user }) => {
        const { body: { keys } } = await superagent_1.default.get(`${idServerUrl}/keys`).query({ limit, offset, user });
        return keys;
    };
    const signFile = async (file) => {
        const fileSha256 = cryptoLib.sha256(file);
        const { armoredSignature } = await pgpLib.signMessage({ msg: fileSha256 });
        const sha256Sigb64 = buffer_1.Buffer.from(armoredSignature).toString("base64");
        return { fileSha256, sha256Sigb64 };
    };
    const signAndUploadFile = async ({ file, filename }) => {
        if (!filename)
            throw "uploadSingedFile with no filename";
        const { fileSha256, sha256Sigb64 } = await signFile(file);
        const { body } = await superagent_1.default
            .post(`${idServerUrl}/keys/meta/upload`)
            .withCredentials()
            // note: order is very important, body before attachment to able to verify data
            .field("nonce", (await getNonce()).nonce)
            .field("sha256", fileSha256)
            .field("sha256Signatureb64", sha256Sigb64)
            .field("keyId", await pgpLib.getKeyFingerprint())
            .attach("upload", file, filename);
        return { fileUrl: body.fileUrl, acl: body.acl, sha256: fileSha256 };
    };
    return {
        signAndUploadKeyMeta,
        registerUserKey,
        getNonce,
        signMetaAttestation,
        getKeyList,
        getKeyAttestations,
        signAndUploadFile,
        signFile
    };
};
exports.sifirId = sifirId;
