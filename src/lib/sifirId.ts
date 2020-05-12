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
const sifirId = ({
  pgpLib = _pgpUtil(),
  idServerUrl = "https://pairing.sifir.io"
} = {}) => {
  const { getPubkeyArmored, signMessage, getKeyFingerprint } = pgpLib;
  const registerUserKey = async ({ user }: RegisterUserKeyParam) => {
    // Request user from id server
    // get nonce
    const {
      body: { serverArmoredPubkeyb64, nonce }
    } = await agent.get(`${idServerUrl}/auth/`);
    const { token, key } = JSON.parse(
      Buffer.from(nonce, "base64").toString("utf8")
    );
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
        pubkeyArmoredb64: Buffer.from(await getPubkeyArmored(), "utf8").toString(
          "base64"
        ),
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

  return { registerUserKey };
};
export { sifirId };
