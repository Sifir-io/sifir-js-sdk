"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpTransport_1 = __importDefault(require("../../../transport/httpTransport"));
const auth_1 = require("./auth");
exports.default = ({ CypherNodeGatewayUrl = (process && process.env.CYPHER_GATEWAY_URL) ||
    "https://localhost:2009/v0/", CypherNodeCertCAPem = (process &&
    process.env.CYPHERNODE_GATEKEEPER_CERT_CA) ||
    "", TorProxyURL = process.env.TOR_PROXY_URL || "", cypherNodeAuthHelper = auth_1.cypherNodeAuthHelper() } = {}) => {
    const { customHeaders } = cypherNodeAuthHelper;
    return httpTransport_1.default({
        gatewayUrl: CypherNodeGatewayUrl,
        customHeaders,
        caCert: CypherNodeCertCAPem,
        proxyUrl: TorProxyURL
    });
};
