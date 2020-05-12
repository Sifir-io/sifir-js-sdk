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
var debug = debug_1.default("sifirutil:");
var sifirId = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.pgpLib, pgpLib = _c === void 0 ? pgpUtil_1.pgpUtil() : _c, _d = _b.idServerUrl, idServerUrl = _d === void 0 ? "https://pairing.sifir.io" : _d;
    var getPubkeyArmored = pgpLib.getPubkeyArmored, signMessage = pgpLib.signMessage, getKeyFingerprint = pgpLib.getKeyFingerprint;
    var registerUserKey = function (_a) {
        var user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, serverArmoredPubkeyb64, nonce, _c, token, key, serverArmoredPubkey, fingerprint, payload, armoredSignature, body, _d, _e, _f, _g, _h, _j, err_1, status_1, text;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, superagent_1.default.get(idServerUrl + "/auth/")];
                    case 1:
                        _b = (_k.sent()).body, serverArmoredPubkeyb64 = _b.serverArmoredPubkeyb64, nonce = _b.nonce;
                        _c = JSON.parse(Buffer.from(nonce, "base64").toString("utf8")), token = _c.token, key = _c.key;
                        serverArmoredPubkey = Buffer.from(serverArmoredPubkeyb64, "base64").toString("utf8");
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, getKeyFingerprint()];
                    case 3:
                        fingerprint = _k.sent();
                        payload = { nonce: nonce, username: user, keyId: fingerprint };
                        return [4 /*yield*/, signMessage({
                                msg: JSON.stringify(payload)
                            })];
                    case 4:
                        armoredSignature = (_k.sent()).armoredSignature;
                        _e = (_d = superagent_1.default.post(idServerUrl + "/auth/register/")).send;
                        _f = [__assign({}, payload)];
                        _g = {};
                        _j = (_h = Buffer).from;
                        return [4 /*yield*/, getPubkeyArmored()];
                    case 5: return [4 /*yield*/, _e.apply(_d, [__assign.apply(void 0, _f.concat([(_g.pubkeyArmoredb64 = _j.apply(_h, [_k.sent(), "utf8"]).toString("base64"), _g.signatureb64 = Buffer.from(armoredSignature, "utf8").toString("base64"), _g)]))])];
                    case 6:
                        body = (_k.sent()).body;
                        return [2 /*return*/, body];
                    case 7:
                        err_1 = _k.sent();
                        status_1 = err_1.status, text = err_1.response.text;
                        debug("error setting node user", status_1, text);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return { registerUserKey: registerUserKey };
};
exports.sifirId = sifirId;
