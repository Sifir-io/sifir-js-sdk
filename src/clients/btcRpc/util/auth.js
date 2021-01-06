"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btcAuthHelper = void 0;
const buffer_1 = require("buffer");
const cryptoUtil_1 = require("../../../lib/cryptoUtil");
const { hmacSHA256Hex } = cryptoUtil_1.crypto();
const btcAuthHelper = ({ rpcUser = (process && process.env.BTC_RPC_USER) || undefined, rpcPass = (process && process.env.BTC_RPC_PASS) || undefined } = {}) => {
    if (!rpcUser || !rpcPass)
        throw "btcAuthHelper missing rpcUser or rpcPass";
    const customHeaders = async ({ command, payload }) => {
        let headers = {
            Authorization: `Basic ${buffer_1.Buffer.from(rpcUser + ":" + rpcPass).toString("base64")}`
        };
        return headers;
    };
    return { customHeaders };
};
exports.btcAuthHelper = btcAuthHelper;
