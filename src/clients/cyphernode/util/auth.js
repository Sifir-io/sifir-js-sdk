"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypherNodeAuthHelper = void 0;
const buffer_1 = require("buffer");
const cryptoUtil_1 = require("../../../lib/cryptoUtil");
const { hmacSHA256Hex } = cryptoUtil_1.crypto();
const cypherNodeAuthHelper = ({ cypherNodeGatewayUrl = (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/", cypherNodeApiKey = (process && process.env.CYPHERNODE_API_KEY) || "", cypherNodeApiKeyID = (process && process.env.CYPHERNODE_API_KEY_ID) || 3, cypherNodeCertCAPem = (process && process.env.CYPHERNODE_GATEKEEPER_CERT_CA) || "", } = {}) => {
    const customHeaders = async ({ command, payload }) => {
        const token = await makeToken(cypherNodeApiKey, cypherNodeApiKeyID);
        let headers = {
            Authorization: `Bearer ${token}`
        };
        return headers;
    };
    const makeToken = async (api_key, perm, expiryInSeconds = 3600) => {
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = buffer_1.Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        const p64 = buffer_1.Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        const msg = h64 + "." + p64;
        const hash = await hmacSHA256Hex(msg, api_key);
        return `${msg}.${hash}`;
    };
    return { customHeaders, makeToken };
};
exports.cypherNodeAuthHelper = cypherNodeAuthHelper;
