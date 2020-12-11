"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpTransport_1 = __importDefault(require("../../../transport/httpTransport"));
const auth_1 = require("./auth");
const { customHeaders } = auth_1.cypherNodeAuthHelper();
const CypherNodeGatewayUrl = (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";
const CypherNodeCertCAPem = (process && process.env.CYPHERNODE_GATEKEEPER_CERT_CA) || "";
const TorProxyURL = process.env.TOR_PROXY_URL || "";
exports.default = () => httpTransport_1.default({ gatewayUrl: CypherNodeGatewayUrl, customHeaders, caCert: CypherNodeCertCAPem, proxyUrl: TorProxyURL });
