"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpTransport_1 = __importDefault(require("../../../transport/httpTransport"));
const auth_1 = require("./auth");
const { customHeaders } = auth_1.lndHelper();
const gatewayUrl = (process && process.env.LND_GATEWAY_URL) || "https://localhost:2009/v0/";
const caCert = (process && process.env.LND_CA_CERT) || "";
const proxyUrl = process.env.TOR_PROXY_URL || "";
exports.default = () => httpTransport_1.default({ gatewayUrl, customHeaders, caCert, proxyUrl });
