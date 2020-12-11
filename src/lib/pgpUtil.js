"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgpUtil = void 0;
const debug_1 = __importDefault(require("debug"));
const buffer_1 = require("buffer");
const _pgp = __importStar(require("openpgp"));
/// TODO move to .d.ts file
const pgpUtil = ({ pgp = _pgp, debug = debug_1.default("sifir:pgputil:") } = {}) => {
    let decryptedPrivkeyObj, pubkeyArmored;
    const _getPrimarykeyFromArmored = async (armoredKey) => {
        const foundKeys = await pgp.key.readArmored(armoredKey);
        const { keys: [primaryKey] } = foundKeys;
        return primaryKey;
    };
    const _getDecryptedPrivateKeyFromArmored = async (armoredPrivatekey, passphrase) => {
        const { keys: [privateKey] } = await pgp.key.readArmored(armoredPrivatekey);
        await privateKey.decrypt(passphrase);
        return privateKey;
    };
    const makeNewPgpKey = async ({ passphrase, email, user }) => {
        const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await pgp.generateKey({
            userIds: [{ name: user, email: email ? email : undefined }],
            curve: "ed25519",
            passphrase
        });
        return {
            privkeyArmored: privateKeyArmored,
            pubkeyArmored: publicKeyArmored,
            revocationCertificate
        };
    };
    const initAndUnlockKeys = async ({ privkeyArmored, passphrase }) => {
        if (!privkeyArmored || !passphrase) {
            throw "Missing key and pass";
        }
        decryptedPrivkeyObj = await _getDecryptedPrivateKeyFromArmored(privkeyArmored, passphrase);
        return {
            pubkeyArmored: decryptedPrivkeyObj.toPublic().armor(),
            fingerprint: decryptedPrivkeyObj.keyPacket.getFingerprint(),
            hexkeyId: buffer_1.Buffer.from(decryptedPrivkeyObj.keyPacket.getKeyId().bytes).toString("hex")
        };
    };
    const getPubkeyArmored = () => {
        if (!decryptedPrivkeyObj)
            throw "Key not init";
        return decryptedPrivkeyObj.toPublic().armor();
    };
    const signMessage = async ({ msg }) => {
        if (!decryptedPrivkeyObj)
            throw "Key not init";
        const { signature: armoredSignature } = await pgp.sign({
            message: await pgp.cleartext.fromText(msg),
            privateKeys: [await decryptedPrivkeyObj],
            detached: true
        });
        return { armoredSignature, message: msg };
    };
    const signMessageWithArmoredKey = async ({ msg, privkeyArmored, passphrase }) => {
        const privKeyToSign = await _getDecryptedPrivateKeyFromArmored(privkeyArmored, passphrase);
        const { signature: armoredSignature } = await pgp.sign({
            message: await pgp.cleartext.fromText(msg),
            privateKeys: [privKeyToSign],
            detached: true
        });
        return { armoredSignature, message: msg };
    };
    const getKeyFingerprint = async ({ armoredkey = undefined, encoding = "utf8" } = {}) => {
        let fingerprint;
        if (!armoredkey) {
            if (!decryptedPrivkeyObj)
                throw "Key not init";
            fingerprint = decryptedPrivkeyObj.keyPacket.getFingerprint();
        }
        else {
            const { primaryKey } = await _getPrimarykeyFromArmored(armoredkey);
            fingerprint = primaryKey.fingerprint;
        }
        return buffer_1.Buffer.from(fingerprint).toString(encoding);
    };
    const encryptMessage = async ({ msg, pubkey }) => {
        if (!decryptedPrivkeyObj)
            throw "Key not init";
        const result = await pgp.encrypt({
            message: pgp.message.fromText(msg),
            publicKeys: pubkey,
            privateKeys: [decryptedPrivkeyObj] // for signing (optional)
        });
        const { data: armoredEncryptedMsg, signature: armoredSignature } = result;
        return { armoredSignature, armoredEncryptedMsg };
    };
    // FIXME implement this, hasnt been used in this context but is part of interface
    const getKeyInfo = async (armoredKey, passphrase = "") => {
        return {
            pubkeyArmored: "",
            fingerprint: "",
            hexkeyId: "",
            isPrivate: false,
            isLocked: false,
            isExpired: true
        };
    };
    // FIXME implement this, hasnt been used in this context but is part of interface
    const verifySignedMessage = async ({ msg, armoredSignature, armoredKey }) => false;
    // FIXME implement this, hasnt been used in this context but is part of interface
    const decryptMessage = async (msg) => {
        return "FIXME IMPLMENET THIS";
    };
    return {
        // getFingerprintFromArmoredKey,
        signMessageWithArmoredKey,
        signMessage,
        encryptMessage,
        getKeyFingerprint,
        getPubkeyArmored,
        makeNewPgpKey,
        initAndUnlockKeys,
        getKeyInfo,
        verifySignedMessage,
        decryptMessage
    };
};
exports.pgpUtil = pgpUtil;
