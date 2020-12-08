import {Buffer} from "buffer";
import {crypto} from "../../../lib/cryptoUtil";

const {hmacSHA256Hex} = crypto();
const cypherNodeAuthHelper = ({
    cypherNodeGatewayUrl =
    (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/",
    cypherNodeApiKey = (process && process.env.CYPHERNODE_API_KEY) || "",
    cypherNodeApiKeyID = (process && process.env.CYPHERNODE_API_KEY_ID) || 3,
    cypherNodeCertCAPem =
    (process && process.env.CYPHERNODE_GATEKEEPER_CERT_CA) || "",
}={})=> {
    const customHeaders = async ({command, payload}: { command: string; payload: string }) => {
        const token = await makeToken(cypherNodeApiKey, cypherNodeApiKeyID as number);
        let headers = {
            Authorization: `Bearer ${token}`
        };
        return headers;
    };
    const makeToken = async (
        api_key: string,
        perm: number,
        expiryInSeconds = 3600
    ): Promise<string> => {
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = Buffer.from(
            JSON.stringify({alg: "HS256", typ: "JWT"})
        ).toString("base64");
        const p64 = Buffer.from(JSON.stringify({id, exp})).toString("base64");
        const msg = h64 + "." + p64;
        const hash = await hmacSHA256Hex(msg, api_key);
        return `${msg}.${hash}`;
    };

    return {customHeaders, makeToken}
};
export {cypherNodeAuthHelper}
