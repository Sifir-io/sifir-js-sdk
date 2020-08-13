"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __importDefault(require("debug"));
var buffer_1 = require("buffer");
var _pgp = __importStar(require("openpgp"));
/// TODO move to .d.ts file
var pgpUtil = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.pgp, pgp = _c === void 0 ? _pgp : _c, _d = _b.debug, debug = _d === void 0 ? debug_1.default("sifir:pgputil:") : _d;
    var decryptedPrivkeyObj, pubkeyArmored;
    var _getPrimarykeyFromArmored = function (armoredKey) { return __awaiter(void 0, void 0, void 0, function () {
        var foundKeys, primaryKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pgp.key.readArmored(armoredKey)];
                case 1:
                    foundKeys = _a.sent();
                    primaryKey = foundKeys.keys[0];
                    return [2 /*return*/, primaryKey];
            }
        });
    }); };
    var _getDecryptedPrivateKeyFromArmored = function (armoredPrivatekey, passphrase) { return __awaiter(void 0, void 0, void 0, function () {
        var privateKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pgp.key.readArmored(armoredPrivatekey)];
                case 1:
                    privateKey = (_a.sent()).keys[0];
                    return [4 /*yield*/, privateKey.decrypt(passphrase)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, privateKey];
            }
        });
    }); };
    var makeNewPgpKey = function (_a) {
        var passphrase = _a.passphrase, email = _a.email, user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, privateKeyArmored, publicKeyArmored, revocationCertificate;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, pgp.generateKey({
                            userIds: [{ name: user, email: email ? email : undefined }],
                            curve: "ed25519",
                            passphrase: passphrase
                        })];
                    case 1:
                        _b = _c.sent(), privateKeyArmored = _b.privateKeyArmored, publicKeyArmored = _b.publicKeyArmored, revocationCertificate = _b.revocationCertificate;
                        return [2 /*return*/, {
                                privkeyArmored: privateKeyArmored,
                                pubkeyArmored: publicKeyArmored,
                                revocationCertificate: revocationCertificate
                            }];
                }
            });
        });
    };
    var initAndUnlockKeys = function (_a) {
        var privkeyArmored = _a.privkeyArmored, passphrase = _a.passphrase;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!privkeyArmored || !passphrase) {
                            throw "Missing key and pass";
                        }
                        return [4 /*yield*/, _getDecryptedPrivateKeyFromArmored(privkeyArmored, passphrase)];
                    case 1:
                        decryptedPrivkeyObj = _b.sent();
                        return [2 /*return*/, {
                                pubkeyArmored: decryptedPrivkeyObj.toPublic().armor(),
                                fingerprint: decryptedPrivkeyObj.keyPacket.getFingerprint(),
                                hexkeyId: buffer_1.Buffer.from(decryptedPrivkeyObj.keyPacket.getKeyId().bytes).toString("hex")
                            }];
                }
            });
        });
    };
    var getPubkeyArmored = function () {
        if (!decryptedPrivkeyObj)
            throw "Key not init";
        return decryptedPrivkeyObj.toPublic().armor();
    };
    var signMessage = function (_a) {
        var msg = _a.msg;
        return __awaiter(void 0, void 0, void 0, function () {
            var armoredSignature, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!decryptedPrivkeyObj)
                            throw "Key not init";
                        _c = (_b = pgp).sign;
                        _d = {};
                        return [4 /*yield*/, pgp.cleartext.fromText(msg)];
                    case 1:
                        _d.message = _e.sent();
                        return [4 /*yield*/, decryptedPrivkeyObj];
                    case 2: return [4 /*yield*/, _c.apply(_b, [(_d.privateKeys = [_e.sent()],
                                _d.detached = true,
                                _d)])];
                    case 3:
                        armoredSignature = (_e.sent()).signature;
                        return [2 /*return*/, { armoredSignature: armoredSignature, message: msg }];
                }
            });
        });
    };
    var signMessageWithArmoredKey = function (_a) {
        var msg = _a.msg, privkeyArmored = _a.privkeyArmored, passphrase = _a.passphrase;
        return __awaiter(void 0, void 0, void 0, function () {
            var privKeyToSign, armoredSignature, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, _getDecryptedPrivateKeyFromArmored(privkeyArmored, passphrase)];
                    case 1:
                        privKeyToSign = _e.sent();
                        _c = (_b = pgp).sign;
                        _d = {};
                        return [4 /*yield*/, pgp.cleartext.fromText(msg)];
                    case 2: return [4 /*yield*/, _c.apply(_b, [(_d.message = _e.sent(),
                                _d.privateKeys = [privKeyToSign],
                                _d.detached = true,
                                _d)])];
                    case 3:
                        armoredSignature = (_e.sent()).signature;
                        return [2 /*return*/, { armoredSignature: armoredSignature, message: msg }];
                }
            });
        });
    };
    var getKeyFingerprint = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.armoredkey, armoredkey = _c === void 0 ? undefined : _c, _d = _b.encoding, encoding = _d === void 0 ? "utf8" : _d;
        return __awaiter(void 0, void 0, void 0, function () {
            var fingerprint, primaryKey;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!!armoredkey) return [3 /*break*/, 1];
                        if (!decryptedPrivkeyObj)
                            throw "Key not init";
                        fingerprint = decryptedPrivkeyObj.keyPacket.getFingerprint();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, _getPrimarykeyFromArmored(armoredkey)];
                    case 2:
                        primaryKey = (_e.sent()).primaryKey;
                        fingerprint = primaryKey.fingerprint;
                        _e.label = 3;
                    case 3: return [2 /*return*/, buffer_1.Buffer.from(fingerprint).toString(encoding)];
                }
            });
        });
    };
    var encryptMessage = function (_a) {
        var msg = _a.msg, pubkey = _a.pubkey;
        return __awaiter(void 0, void 0, void 0, function () {
            var result, armoredEncryptedMsg, armoredSignature;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!decryptedPrivkeyObj)
                            throw "Key not init";
                        return [4 /*yield*/, pgp.encrypt({
                                message: pgp.message.fromText(msg),
                                publicKeys: pubkey,
                                privateKeys: [decryptedPrivkeyObj] // for signing (optional)
                            })];
                    case 1:
                        result = _b.sent();
                        armoredEncryptedMsg = result.data, armoredSignature = result.signature;
                        return [2 /*return*/, { armoredSignature: armoredSignature, armoredEncryptedMsg: armoredEncryptedMsg }];
                }
            });
        });
    };
    // FIXME implement this, hasnt been used in this context but is part of interface
    var getKeyInfo = function (armoredKey, passphrase) {
        if (passphrase === void 0) { passphrase = ""; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        pubkeyArmored: "",
                        fingerprint: "",
                        hexkeyId: "",
                        isPrivate: false,
                        isLocked: false,
                        isExpired: true
                    }];
            });
        });
    };
    return {
        // getFingerprintFromArmoredKey,
        signMessageWithArmoredKey: signMessageWithArmoredKey,
        signMessage: signMessage,
        encryptMessage: encryptMessage,
        getKeyFingerprint: getKeyFingerprint,
        getPubkeyArmored: getPubkeyArmored,
        makeNewPgpKey: makeNewPgpKey,
        initAndUnlockKeys: initAndUnlockKeys,
        getKeyInfo: getKeyInfo
    };
};
exports.pgpUtil = pgpUtil;
