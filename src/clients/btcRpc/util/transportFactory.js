"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpTransport_1 = __importDefault(require("../../../transport/httpTransport"));
const auth_1 = require("./auth");
exports.default = ({ rpcUrl = (process && process.env.BTC_RPC_URL) || "https://localhost:8332/", rpcCert = (process && process.env.BTC_RPC_CERT) || "", proxyUrl = process.env.TOR_PROXY_URL || "", btcAuthHelper = auth_1.btcAuthHelper() } = {}) => {
    const { customHeaders } = btcAuthHelper;
    return httpTransport_1.default({
        gatewayUrl: rpcUrl,
        customHeaders,
        caCert: rpcCert,
        proxyUrl
    });
};
