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
var debug_1 = __importDefault(require("debug"));
var ava_1 = require("ava");
var pgpUtil_1 = require("./pgpUtil");
var test = ava_1.serial;
var debug = debug_1.default("sifir:pgputilspec");
test.before(function (t) {
    t.context = __assign({}, pgpUtil_1.pgpUtil());
});
test.skip("Should generate a new PGP key", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var makeNewPgpKey, _a, privateKeyArmored, publicKeyArmored, revocationCertificate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                makeNewPgpKey = t.context.makeNewPgpKey;
                return [4 /*yield*/, makeNewPgpKey({
                        passphrase: "random pas",
                        user: "testuser"
                    })];
            case 1:
                _a = _b.sent(), privateKeyArmored = _a.privateKeyArmored, publicKeyArmored = _a.publicKeyArmored, revocationCertificate = _a.revocationCertificate;
                t.true(!!privateKeyArmored.length);
                t.true(!!publicKeyArmored.length);
                t.true(!!revocationCertificate.length);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to init and unlock keys, returning fingerprint, hex and pubkey", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, makeNewPgpKey, initAndUnlockKeys, passphrase, _b, privateKeyArmored, publicKeyArmored, revocationCertificate, _c, fingerprint, hexkeyId, pubkeyArmored;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = t.context, makeNewPgpKey = _a.makeNewPgpKey, initAndUnlockKeys = _a.initAndUnlockKeys;
                passphrase = "random pas";
                return [4 /*yield*/, makeNewPgpKey({
                        passphrase: passphrase,
                        user: "testuser"
                    })];
            case 1:
                _b = _d.sent(), privateKeyArmored = _b.privateKeyArmored, publicKeyArmored = _b.publicKeyArmored, revocationCertificate = _b.revocationCertificate;
                return [4 /*yield*/, initAndUnlockKeys({
                        privatekeyArmored: privateKeyArmored,
                        passphrase: passphrase
                    })];
            case 2:
                _c = _d.sent(), fingerprint = _c.fingerprint, hexkeyId = _c.hexkeyId, pubkeyArmored = _c.pubkeyArmored;
                t.true(!!fingerprint.length);
                t.true(!!hexkeyId.length);
                t.true(!!pubkeyArmored);
                return [2 /*return*/];
        }
    });
}); });
// FIXME standrazie make new key return types, integration test API register call
// 2. Update RN pgp libb
//
