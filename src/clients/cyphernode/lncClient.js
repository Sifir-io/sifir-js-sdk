"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const transportFactory_1 = __importDefault(require("./util/transportFactory"));
// TODO finish replacing rest of commands
var CyphernodeLnCommands;
(function (CyphernodeLnCommands) {
    CyphernodeLnCommands["GET_INFO"] = "ln_getinfo";
    CyphernodeLnCommands["GET_CONN_STRING"] = "ln_getconnectionstring";
    CyphernodeLnCommands["GET_NEW_ADDR"] = "ln_newaddr";
    CyphernodeLnCommands["CONNECT_FUND"] = "ln_connectfund";
    CyphernodeLnCommands["CREATE_INVOICE"] = "ln_create_invoice";
    CyphernodeLnCommands["GET_INVOICES"] = "ln_getinvoice";
    CyphernodeLnCommands["DEL_INVOICE"] = "ln_delinvoice";
    CyphernodeLnCommands["DECODE_BOLT"] = "ln_decodebolt11";
    CyphernodeLnCommands["GET_ROUTE"] = "ln_getroute";
    CyphernodeLnCommands["LIST_PEERS"] = "ln_listpeers";
    CyphernodeLnCommands["LIST_FUNDS"] = "ln_listfunds";
    CyphernodeLnCommands["LIST_PAYMENTS"] = "ln_listpays";
    CyphernodeLnCommands["PAY_BOLT11"] = "ln_pay";
    CyphernodeLnCommands["WITHDRAW"] = "ln_withdraw";
})(CyphernodeLnCommands || (CyphernodeLnCommands = {}));
exports.client = ({ transport = transportFactory_1.default() } = {}) => {
    const { get, post } = transport;
    const api = {
        // FIXME update this to get 'a' nodes info if id is provided
        // Implement listnodes/nodeId
        //	  https://lightning.readthedocs.io/lightning-listnodes.7.html
        getNodeInfo(nodeId) {
            return get(CyphernodeLnCommands.GET_INFO);
        },
        async getConnectionString() {
            const { connectstring } = await get(CyphernodeLnCommands.GET_CONN_STRING);
            return connectstring;
        },
        async getNewAddress() {
            const { address } = await get(CyphernodeLnCommands.GET_NEW_ADDR);
            return address;
        },
        openAndFundPeerChannel(payload) {
            return post(CyphernodeLnCommands.CONNECT_FUND, payload);
        },
        createInvoice(invoice) {
            return post(CyphernodeLnCommands.CREATE_INVOICE, invoice);
        },
        async getInvoice(invoiceLabel) {
            const { invoices } = await get("ln_getinvoice", invoiceLabel);
            return invoices;
        },
        /** FAILS 403 */
        async deleteInvoice(invoiceLabel) {
            const invoice = await get("ln_delinvoice", invoiceLabel);
            return invoice;
        },
        decodeBolt(bolt11) {
            return get("ln_decodebolt11", bolt11);
        },
        async getRoute(nodeId, amount, riskFactor = 0) {
            const { route } = await get("ln_getroute", [nodeId, amount, riskFactor].join("/"));
            return [route];
        },
        async listPeers(nodeId) {
            const { peers } = await get("ln_listpeers", nodeId);
            return peers;
        },
        listFunds() {
            return get("ln_listfunds");
        },
        async listPays(bolt11) {
            const { pays } = await get("ln_listpays");
            return pays;
        },
        async payBolt11(bolt11, expectedMsatoshi, expectedDesc) {
            const payresult = await post("ln_pay", {
                bolt11,
                expected_msatoshi: expectedMsatoshi ? expectedMsatoshi : undefined,
                expected_description: expectedDesc ? expectedDesc : undefined
            });
            return payresult;
        },
        withdrawFunds(destination, satoshi, feerate = "normal") {
            return post("ln_withdraw", {
                destination,
                satoshi,
                feerate
            });
        }
        // TODO clighning can do both these but cn non
        //	  keySend()
        //	  listTransactions();
    };
    return api;
};
