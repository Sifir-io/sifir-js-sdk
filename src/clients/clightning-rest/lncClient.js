"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const units_1 = require("../../lib/units");
const transportFactory_1 = __importDefault(require("./util/transportFactory"));
exports.client = ({ transport = transportFactory_1.default() } = {}) => {
    const { get, post, delete: del } = transport;
    const api = {
        async getNodeInfo(nodeId) {
            if (nodeId) {
                const [node] = await get("v1/network/listNode", nodeId);
                return { ...node, id: node.nodeid, address: node.addresses };
            }
            else {
                const node = await get("v1/getinfo");
                console.error(nodeId, node);
                return node;
            }
        },
        async getConnectionString() {
            const info = await get("v1/getinfo");
            const { address, id } = info;
            if (!address)
                return "";
            const [{ port, type, address: nodeAddress }] = address;
            return `${id}@${nodeAddress}:${port}`;
        },
        async getNewAddress() {
            const { address } = await get("v1/newaddr");
            return address;
        },
        async openAndFundPeerChannel(payload) {
            await post("v1/peer/connect/", {
                id: payload.peer
            });
            const result = await post("v1/channel/openChannel/", {
                id: payload.peer.split("@")[0],
                satoshis: units_1.toUnit(payload.msatoshi, units_1.BtcUnits.MSAT, units_1.BtcUnits.SAT),
                feerate: payload.target_conf,
                minConf: payload.min_confs
            });
            return result;
        },
        async createInvoice(invoice) {
            const cIn = await post("v1/invoice/genInvoice/", {
                ...invoice,
                amount: invoice.msatoshi
            });
            return {
                ...cIn,
                id: invoice.label
            };
        },
        async getInvoice(invoiceLabel) {
            const { invoices } = await get("v1/invoice/listInvoices", invoiceLabel);
            return invoices;
        },
        // FIXME 404 ?
        async deleteInvoice(invoiceLabel) {
            const invoice = await del("v1/invoice/delInvoice", invoiceLabel);
            return invoice;
        },
        decodeBolt(bolt11) {
            return get("v1/pay/decodePay", bolt11);
        },
        async getRoute(nodeId, amount, riskFactor = 0) {
            const route = await get("v1/network/getroute", [nodeId, amount].join("/"));
            return [route];
        },
        async listPeers(nodeId) {
            const peers = await get("v1/peer/listPeers", nodeId);
            return peers;
        },
        listFunds() {
            return get("v1/listfunds");
        },
        async listPays(bolt11) {
            const { pays } = await get("v1/pay/listpays", bolt11);
            return pays;
        },
        async payBolt11(bolt11, expectedMsatoshi, expectedDesc) {
            const payresult = await post("v1/pay", {
                invoice: bolt11,
                amount: expectedMsatoshi ? expectedMsatoshi : undefined
            });
            // Cln rest doens't return route ?
            return { ...payresult, route: [] };
        },
        withdrawFunds(destination, satoshi, feerate = "normal") {
            return post("v1/withdraw", {
                address: destination,
                satoshis: satoshi,
                feeRate: feerate
            });
        }
        // TODO clighning can do both these but cn non
        //	  keySend()
        //	  listTransactions();
    };
    return api;
};
