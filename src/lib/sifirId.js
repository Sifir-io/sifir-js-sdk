"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var pgpUtil_1 = require("./pgpUtil");
var debug_1 = __importDefault(require("debug"));
var superagent_1 = __importDefault(require("superagent"));
var buffer_1 = require("buffer");
var debug = debug_1.default("sifirutil:");
var KeyMetaTypes = {
    keyUserAvatarImg: "keyUserAvatarImg",
    keyUserDisplayName: "keyUserDisplayName",
    keyUserBio: "keyUserBio",
    keyUserWebsiteUrl: "keyUserWebsiteUrl",
    keyUserEmail: "keyUserEmail",
    keyUserTwitter: "keyUserTwitter"
};
exports.KeyMetaTypes = KeyMetaTypes;
var sifirId = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.pgpLib, pgpLib = _c === void 0 ? pgpUtil_1.pgpUtil() : _c, _d = _b.idServerUrl, idServerUrl = _d === void 0 ? "https://pairing.sifir.io" : _d;
    var getPubkeyArmored = pgpLib.getPubkeyArmored, signMessage = pgpLib.signMessage, getKeyFingerprint = pgpLib.getKeyFingerprint;
    var getNonce = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, serverArmoredPubkeyb64, nonce;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(idServerUrl + "/auth/")];
                case 1:
                    _a = (_b.sent()).body, serverArmoredPubkeyb64 = _a.serverArmoredPubkeyb64, nonce = _a.nonce;
                    return [2 /*return*/, { nonce: nonce, serverArmoredPubkeyb64: serverArmoredPubkeyb64 }];
            }
        });
    }); };
    var registerUserKey = function (_a) {
        var user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, nonce, serverArmoredPubkeyb64, serverArmoredPubkey, fingerprint, payload, armoredSignature, body, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, getNonce()];
                    case 1:
                        _b = _j.sent(), nonce = _b.nonce, serverArmoredPubkeyb64 = _b.serverArmoredPubkeyb64;
                        serverArmoredPubkey = buffer_1.Buffer.from(serverArmoredPubkeyb64, "base64").toString("utf8");
                        return [4 /*yield*/, getKeyFingerprint()];
                    case 2:
                        fingerprint = _j.sent();
                        payload = { nonce: nonce, username: user, keyId: fingerprint };
                        return [4 /*yield*/, signMessage({
                                msg: JSON.stringify(payload)
                            })];
                    case 3:
                        armoredSignature = (_j.sent()).armoredSignature;
                        _d = (_c = superagent_1.default.post(idServerUrl + "/auth/register/")).send;
                        _e = [__assign({}, payload)];
                        _f = {};
                        _h = (_g = buffer_1.Buffer).from;
                        return [4 /*yield*/, getPubkeyArmored()];
                    case 4: return [4 /*yield*/, _d.apply(_c, [__assign.apply(void 0, _e.concat([(_f.pubkeyArmoredb64 = _h.apply(_g, [_j.sent(), "utf8"]).toString("base64"), _f.signatureb64 = buffer_1.Buffer.from(armoredSignature, "utf8").toString("base64"), _f)]))])];
                    case 5:
                        body = (_j.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    var signAndUploadKeyMeta = function (metaKey, metaValueb64) { return __awaiter(void 0, void 0, void 0, function () {
        var keyId, armoredSignature, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getKeyFingerprint()];
                case 1:
                    keyId = _a.sent();
                    return [4 /*yield*/, signMessage({
                            msg: metaValueb64
                        })];
                case 2:
                    armoredSignature = (_a.sent()).armoredSignature;
                    return [4 /*yield*/, superagent_1.default.post(idServerUrl + "/keys/meta").send({
                            metaKey: metaKey,
                            metaValueb64: metaValueb64,
                            signatureb64: buffer_1.Buffer.from(armoredSignature).toString("base64"),
                            keyId: keyId
                        })];
                case 3:
                    body = (_a.sent()).body;
                    return [2 /*return*/, body];
            }
        });
    }); };
    var signAndUploadKeyAvatar = function (photoBase64) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserAvatarImg, photoBase64)];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signAndUploadKeyDisplayName = function (displayName) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserDisplayName, buffer_1.Buffer.from(displayName).toString("base64"))];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signAndUploadKeyBio = function (bio) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserBio, buffer_1.Buffer.from(bio).toString("base64"))];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signAndUploadKeyWebsiteURL = function (siteUrl) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserWebsiteUrl, buffer_1.Buffer.from(siteUrl).toString("base64"))];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signAndUploadKeyEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserEmail, buffer_1.Buffer.from(email).toString("base64"))];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signAndUploadKeyTwitter = function (twitterHandle) { return __awaiter(void 0, void 0, void 0, function () {
        var metaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signAndUploadKeyMeta(KeyMetaTypes.keyUserTwitter, buffer_1.Buffer.from(twitterHandle).toString("base64"))];
                case 1:
                    metaId = (_a.sent()).metaId;
                    return [2 /*return*/, metaId];
            }
        });
    }); };
    var signMetaAttestation = function (_a) {
        var metaId = _a.metaId, metaValueb64 = _a.metaValueb64, metaSignatureb64 = _a.metaSignatureb64, attestations = _a.attestations // FIXME ... do we sign this
        ;
        return __awaiter(void 0, void 0, void 0, function () {
            var armoredSignature, attestingPayload, _b, body;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, signMessage({
                            msg: metaSignatureb64
                        })];
                    case 1:
                        armoredSignature = (_c.sent()).armoredSignature;
                        _b = {
                            metaId: metaId,
                            metaSignatureb64: metaSignatureb64,
                            signatureb64: buffer_1.Buffer.from(armoredSignature).toString("base64")
                        };
                        return [4 /*yield*/, getKeyFingerprint()];
                    case 2:
                        attestingPayload = (_b.keyId = _c.sent(),
                            _b);
                        return [4 /*yield*/, superagent_1.default
                                .post(idServerUrl + "/keys/meta/" + metaId + "/attest")
                                .send(attestingPayload)];
                    case 3:
                        body = (_c.sent()).body;
                        return [2 /*return*/, body.attestationId];
                }
            });
        });
    };
    var getKeyAttestations = function (keyId) { return __awaiter(void 0, void 0, void 0, function () {
        var body, keyMetaInfo, keyInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(idServerUrl + "/keys/" + keyId)];
                case 1:
                    body = (_a.sent()).body;
                    keyMetaInfo = body.keyMetaInfo, keyInfo = body.keyInfo;
                    return [2 /*return*/, { keyMetaInfo: keyMetaInfo, keyInfo: keyInfo }];
            }
        });
    }); };
    var getKeyList = function (_a) {
        var _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.offset, offset = _c === void 0 ? 0 : _c, user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, superagent_1.default.get(idServerUrl + "/keys").query({ limit: limit, offset: offset, user: user })];
                    case 1:
                        keys = (_d.sent()).body.keys;
                        return [2 /*return*/, keys];
                }
            });
        });
    };
    return {
        registerUserKey: registerUserKey,
        getNonce: getNonce,
        signAndUploadKeyAvatar: signAndUploadKeyAvatar,
        signAndUploadKeyDisplayName: signAndUploadKeyDisplayName,
        signMetaAttestation: signMetaAttestation,
        signAndUploadKeyBio: signAndUploadKeyBio,
        signAndUploadKeyWebsiteURL: signAndUploadKeyWebsiteURL,
        signAndUploadKeyEmail: signAndUploadKeyEmail,
        signAndUploadKeyTwitter: signAndUploadKeyTwitter,
        getKeyList: getKeyList,
        getKeyAttestations: getKeyAttestations
    };
};
exports.sifirId = sifirId;
