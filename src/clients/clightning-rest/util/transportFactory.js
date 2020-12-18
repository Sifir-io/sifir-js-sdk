"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpTransport_1 = __importDefault(require("../../../transport/httpTransport"));
const auth_1 = require("./auth");
exports.default = ({ gatewayUrl = (process && process.env.CLNREST_GATEWAY_URL) ||
    "https://localhost:3003/", caCert = (process && process.env.CLNREST_CA_CERT) || "", proxyUrl = process.env.TOR_PROXY_URL || "", clnrestHelper = auth_1.clnRestHelper() } = {}) => {
    const { customHeaders } = clnrestHelper;
    return httpTransport_1.default({ gatewayUrl, customHeaders, caCert, proxyUrl });
};
