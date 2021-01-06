"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const transportFactory_1 = __importDefault(require("./util/transportFactory"));
exports.client = ({ transport = transportFactory_1.default() } = {}) => {
    const { post } = transport;
    // override get method from http transport to duck data into btccore rpc's post request format
    const get = (method, param) => post("/", {
        jsonrpc: "1.0",
        id: "1",
        method,
        params: param || []
    });
    const api = {
        /** Core and Spending */
        async getBlockChainInfo() {
            const { result } = await get("getblockchaininfo");
            return result;
        },
        async getNewAddress(type = "p2sh-segwit", label = "") {
            const { result: address } = await get("getnewaddress", [label, type]);
            return address;
        },
        async getBlockHash(height) {
            const { result: blockHash } = await get("getblockhash", [height]);
            return blockHash;
        },
        async getBestBlockHash() {
            const { result: blockHash } = await get("getbestblockhash");
            return blockHash;
        },
        async getBestBlockInfo() {
            const blockHash = await api.getBestBlockHash();
            return await api.getBlockInfo(blockHash);
        },
        async getBlockInfo(blockHash) {
            const { result: blockInfo } = await get("getblock", [blockHash]);
            return blockInfo;
        },
        async getTxn(txnHash) {
            const { result: txnInfo } = await get("gettransaction", [txnHash]);
            return txnInfo;
        },
        async getBalance() {
            const { result: balance } = await get("getbalance");
            return balance;
        },
        async getTxnsSpending(count = 10, skip = 0, label = "*") {
            const { result: txns } = await get("listtransactions", [
                label,
                count,
                skip
            ]);
            return txns;
        },
        async spend(address, amount, confTarget = 6, replaceable = true, subtractFee = false, txnComment = "", toComment = "") {
            const result = await post("sendtoaddress", {
                address,
                amount,
                txnComment,
                toComment,
                subtractFee,
                replaceable,
                confTarget
            });
            return result;
        },
        async bumpTxnFee(txnId, confTarget = 0, totalFee = 0) {
            throw "Please provide a confTarget or totalFee";
            const { result } = await post("bumpfee", [
                txnId,
                {
                    confTarget: confTarget > 0 ? confTarget : undefined,
                    totalFee: totalFee > 0 ? totalFee : undefined
                }
            ]);
            return result;
        },
        // FIXME HERE BELOW THIS DO WE DO WATCHING OF BTC PAIRINGS OR NOT NOW ?
        /** Txn and Address watch & unwatch */
        async watchTxnId(txn, options) {
            let param = {
                nbxconf: 6,
                ...options
            };
            const result = await post("watchtxid", { txid: txn, ...param });
            return result;
        },
        async watchAddress(address, options) {
            const result = await post("watch", {
                address,
                ...options
            });
            return result;
        },
        async getActiveAddressWatch() {
            const { watches } = await get("getactivewatches");
            return watches;
        },
        async unwatchAddress(address) {
            const result = await get("unwatch", address);
            return result;
        },
        /** Pub32 watch & unwatch */
        async watchPub32(xpub, options) {
            if (!options.label)
                throw "Label is required to for a pub32 watch";
            if (/[^0-9a-zA-Z_i ]/.test(options.label))
                throw "Labels must be alpha numeric or _";
            if (!options.nstart || isNaN(options.nstart))
                throw "nstart must be provided and must be a number";
            const result = await post("watchxpub", {
                pub32: xpub,
                ...options
            });
            return result;
        },
        async getWatchedAddressesByPub32(xpub) {
            const { watches } = await get("getactivewatchesbyxpub", xpub);
            return watches;
        },
        async getWatchedAddressesByPub32Label(label) {
            const { watches } = await get("getactivewatchesbylabel", label);
            return watches;
        },
        async getWatchedPub32() {
            const { watches } = await get("getactivexpubwatches");
            return watches;
        },
        async unwatchPub32(xpub) {
            const result = await get("unwatchxpubbyxpub", xpub);
            return result;
        },
        async unwatchPub32ByLabel(label) {
            const result = await get("unwatchxpubbylabel", label);
            return result;
        },
        /** Pub32 Balance */
        async getBalanceByPub32(xpub) {
            const { balance } = await get("getbalancebyxpub", xpub);
            return balance;
        },
        async getBalanceByPub32Label(label) {
            const { balance } = await get("getbalancebyxpublabel", label);
            return balance;
        },
        async getUnusedAddressesByPub32Label(label, count = 10) {
            const { label_unused_addresses } = await get("get_unused_addresses_by_watchlabel", [label, count].join("/"));
            return label_unused_addresses;
        },
        async getTransactionsByPub32Label(label, count = 10) {
            const { label_txns } = await get("get_txns_by_watchlabel", [label, count].join("/"));
            return label_txns;
        }
    };
    return api;
};
