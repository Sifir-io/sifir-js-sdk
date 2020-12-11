"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const transportFactory_1 = __importDefault(require("./util/transportFactory"));
exports.client = ({ transport = transportFactory_1.default() } = {}) => {
    const { get, post } = transport;
    const api = {
        getNewAddress(label) {
            return post("wasabi_getnewaddress", { label });
        },
        getBalances(anonset) {
            return get("wasabi_getbalances", anonset);
        },
        getUnspentCoins(instanceId) {
            return get("wasabi_getunspentcoins", instanceId);
        },
        getTxns({ instanceId, txnFilterInternal } = {}) {
            return post("wasabi_gettransactions", { instanceId, txnFilterInternal });
        },
        async spend(param) {
            return post("wasabi_spend", param);
        },
        async autoSpendReadyCoins() {
            return get("wasabi_spendprivate");
        }
    };
    return api;
};
