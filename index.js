"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.btcUtils = exports.cryptoUtils = exports.sifirId = exports.pgpUtil = exports.apis = void 0;
const btcClient_1 = require("./src/clients/cyphernode/btcClient");
const lncClient_1 = require("./src/clients/cyphernode/lncClient");
const otsClient_1 = require("./src/clients/cyphernode/otsClient");
const wasabiClient_1 = require("./src/clients/cyphernode/wasabiClient");
const cnClient_1 = require("./src/clients/cyphernode/cnClient");
const auth_1 = require("./src/clients/cyphernode/util/auth");
const auth_2 = require("./src/clients/lnd/util/auth");
const lndClient_1 = require("./src/clients/lnd/lndClient");
const auth_3 = require("./src/clients/clightning-rest/util/auth");
const lncClient_2 = require("./src/clients/clightning-rest/lncClient");
const btcClient_2 = require("./src/clients/btcRpc/btcClient");
const auth_4 = require("./src/clients/btcRpc/util/auth");
const units_1 = require("./src/lib/units");
const cyphernode = {
    btcClient: btcClient_1.client,
    lnClient: lncClient_1.client,
    otsClient: otsClient_1.client,
    wasabiClient: wasabiClient_1.client,
    cnClient: cnClient_1.client,
    authHelper: auth_1.cypherNodeAuthHelper
};
const lnd = {
    lndClient: lndClient_1.client,
    lndAuthHelper: auth_2.lndHelper
};
const clnRest = {
    clnRestClient: lncClient_2.client,
    clnRestHelper: auth_3.clnRestHelper
};
const btcRpc = {
    btcRpcClient: btcClient_2.client,
    btcAuthHelper: auth_4.btcAuthHelper
};
const apis = {
    lnd,
    clnRest,
    cyphernode,
    btcRpc,
};
exports.apis = apis;
const btcUtils = {
    toUnit: units_1.toUnit,
    BtcUnits: units_1.BtcUnits
};
exports.btcUtils = btcUtils;
const cryptoUtil_1 = require("./src/lib/cryptoUtil");
Object.defineProperty(exports, "cryptoUtils", { enumerable: true, get: function () { return cryptoUtil_1.crypto; } });
const pgpUtil_1 = require("./src/lib/pgpUtil");
Object.defineProperty(exports, "pgpUtil", { enumerable: true, get: function () { return pgpUtil_1.pgpUtil; } });
const sifirId_1 = require("./src/lib/sifirId");
Object.defineProperty(exports, "sifirId", { enumerable: true, get: function () { return sifirId_1.sifirId; } });
// types
__exportStar(require("./src/lib/types/sifirId"), exports);
__exportStar(require("./src/lib/types/clients"), exports);
__exportStar(require("./src/lib/types/lightning-c"), exports);
__exportStar(require("./src/lib/types/btc"), exports);
__exportStar(require("./src/lib/types/pgpUtil"), exports);
