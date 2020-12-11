"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
exports.crypto = () => {
    let hmacSHA256Hex = async (text, key) => {
        // TODO replace most of code here with this new isomorphic
        const hmac = crypto_js_1.default.algo.HMAC.create(crypto_js_1.default.algo.SHA256, key);
        hmac.update(text);
        const hash = hmac.finalize();
        return crypto_js_1.default.enc.Hex.stringify(hash);
    };
    /**
     * Returns a Hex encoded sha256 of the provided Buffer
     * */
    const sha256 = (buffer) => {
        return crypto_js_1.default.SHA256(crypto_js_1.default.lib.WordArray.create(buffer)).toString(crypto_js_1.default.enc.Hex);
    };
    return { hmacSHA256Hex, sha256, CryptoJS: crypto_js_1.default };
};
