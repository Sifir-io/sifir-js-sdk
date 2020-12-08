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
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var transportFactory_1 = __importDefault(require("./util/transportFactory"));
// TODO finish replacing rest of commands
var SifirLnCommands;
(function (SifirLnCommands) {
    SifirLnCommands["GET_INFO"] = "ln_getinfo";
    SifirLnCommands["GET_CONN_STRING"] = "ln_getconnectionstring";
    SifirLnCommands["GET_NEW_ADDR"] = "ln_newaddr";
    SifirLnCommands["CONNECT_FUND"] = "ln_connectfund";
    SifirLnCommands["CREATE_INVOICE"] = "ln_create_invoice";
    SifirLnCommands["GET_INVOICES"] = "ln_getinvoice";
    SifirLnCommands["DEL_INVOICE"] = "ln_delinvoice";
    SifirLnCommands["DECODE_BOLT"] = "ln_decodebolt11";
    SifirLnCommands["GET_ROUTE"] = "ln_getroute";
    SifirLnCommands["LIST_PEERS"] = "ln_listpeers";
    SifirLnCommands["LIST_FUNDS"] = "ln_listfunds";
    SifirLnCommands["LIST_PAYMENTS"] = "ln_listpays";
    SifirLnCommands["PAY_BOLT11"] = "ln_pay";
    SifirLnCommands["WITHDRAW"] = "ln_withdraw";
})(SifirLnCommands || (SifirLnCommands = {}));
exports.client = function (_a) {
    var _b = (_a === void 0 ? {} : _a).transport, transport = _b === void 0 ? transportFactory_1.default() : _b;
    var get = transport.get, post = transport.post;
    var api = {
        getNodeInfo: function () {
            return get(SifirLnCommands.GET_INFO);
        },
        getConnectionString: function () {
            return __awaiter(this, void 0, void 0, function () {
                var connectstring;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get(SifirLnCommands.GET_CONN_STRING)];
                        case 1:
                            connectstring = (_a.sent()).connectstring;
                            return [2 /*return*/, connectstring];
                    }
                });
            });
        },
        getNewAddress: function () {
            return __awaiter(this, void 0, void 0, function () {
                var address;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get(SifirLnCommands.GET_NEW_ADDR)];
                        case 1:
                            address = (_a.sent()).address;
                            return [2 /*return*/, address];
                    }
                });
            });
        },
        openAndFundPeerChannel: function (payload) {
            return post(SifirLnCommands.CONNECT_FUND, payload);
        },
        createInvoice: function (invoice) {
            return post(SifirLnCommands.CREATE_INVOICE, invoice);
        },
        getInvoice: function (invoiceLabel) {
            return __awaiter(this, void 0, void 0, function () {
                var invoices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("ln_getinvoice", invoiceLabel)];
                        case 1:
                            invoices = (_a.sent()).invoices;
                            return [2 /*return*/, invoices];
                    }
                });
            });
        },
        /** FAILS 403 */
        deleteInvoice: function (invoiceLabel) {
            return __awaiter(this, void 0, void 0, function () {
                var invoice;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("ln_delinvoice", invoiceLabel)];
                        case 1:
                            invoice = _a.sent();
                            return [2 /*return*/, invoice];
                    }
                });
            });
        },
        decodeBolt: function (bolt11) {
            return get("ln_decodebolt11", bolt11);
        },
        getRoute: function (nodeId, amount, riskFactor) {
            if (riskFactor === void 0) { riskFactor = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var route;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("ln_getroute", [nodeId, amount, riskFactor].join("/"))];
                        case 1:
                            route = (_a.sent()).route;
                            return [2 /*return*/, route];
                    }
                });
            });
        },
        listPeers: function (nodeId) {
            return __awaiter(this, void 0, void 0, function () {
                var peers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("ln_listpeers", nodeId)];
                        case 1:
                            peers = (_a.sent()).peers;
                            return [2 /*return*/, peers];
                    }
                });
            });
        },
        listFunds: function () {
            return get("ln_listfunds");
        },
        listPays: function (bolt11) {
            return __awaiter(this, void 0, void 0, function () {
                var pays;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("ln_listpays")];
                        case 1:
                            pays = (_a.sent()).pays;
                            return [2 /*return*/, pays];
                    }
                });
            });
        },
        payBolt11: function (bolt11, expectedMsatoshi, expectedDesc) {
            return __awaiter(this, void 0, void 0, function () {
                var payresult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, post("ln_pay", {
                                bolt11: bolt11,
                                expected_msatoshi: expectedMsatoshi ? expectedMsatoshi : undefined,
                                expected_description: expectedDesc ? expectedDesc : undefined
                            })];
                        case 1:
                            payresult = _a.sent();
                            return [2 /*return*/, payresult];
                    }
                });
            });
        },
        withdrawFunds: function (destination, satoshi, feerate) {
            if (feerate === void 0) { feerate = "normal"; }
            return post("ln_withdraw", {
                destination: destination,
                satoshi: satoshi,
                feerate: feerate
            });
        }
    };
    return api;
};
