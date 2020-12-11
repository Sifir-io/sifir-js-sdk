"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const lndClient_1 = require("./lndClient");
const v4_1 = __importDefault(require("uuid/v4"));
const test = ava_1.serial;
test.before(t => {
    t.context = {
        lightingInvoiceLabel: v4_1.default(),
        ...lndClient_1.client()
    };
});
/**
LN tests
*/
test("Should be able to get the lightning nodes info", async (t) => {
    const { context: { getNodeInfo } } = t;
    const nodeInfo = await getNodeInfo();
    t.true(!!nodeInfo.id.length);
    // Should be defined for our own node
    t.false(isNaN(nodeInfo.blockheight));
    t.false(isNaN(nodeInfo.num_peers));
});
test("Should be able to another nodes info", async (t) => {
    const { context: { getNodeInfo } } = t;
    const nodeInfo = await getNodeInfo("0308dbd05278e5802dd36436a41b226824283526eb14a08d334cbbc878243b243c");
    t.true(!!nodeInfo.id.length);
    t.true(!!nodeInfo.alias);
    t.true(!!nodeInfo.address.length);
    // Should be defined for our own node
});
test.skip("Should be able to a connection string", async (t) => {
    const { context: { getConnectionString } } = t;
    const connString = await getConnectionString();
    t.is(connString.length, 86);
});
test("Should be able to a new LN address", async (t) => {
    const { context: { getNewAddress } } = t;
    const addrs = await getNewAddress();
    t.is(addrs.length, 42);
});
test("Should be able to create an invoice", async (t) => {
    const { context: { createInvoice, lightingInvoiceLabel } } = t;
    const makeInvoicePayload = {
        msatoshi: 23,
        label: lightingInvoiceLabel,
        description: "Ava Test Inovice",
        expiry: 900,
        callback_url: "http://192.168.122.159"
    };
    const body = await createInvoice(makeInvoicePayload);
    t.true(!!body);
    const invoice = body;
    t.true(parseInt(invoice.id) > 0);
    t.true(invoice.bolt11.indexOf("ln") === 0);
    t.true(!!invoice.payment_hash.length);
});
test("Should be able to decode a bolt", async (t) => {
    const { context: { decodeBolt } } = t;
    const bolt11 = "lntb230p1p0aply3pp56hzv6rdq9hxs2jykqpthk3ssmjxwzdecxaph6veex7ae6lwdeshsdq6g9mxzgz5v4ehggzfdehhv6trv5cqzpgxqzuysp5z8nm70aapkmagevr5h6f497uyte6x8ue4g76kat7ufsf40e55hdq9qyyssqnxpyyyzwtml6asu2asm9syqu44vhqdmm08w0mdp6kxjze8wv5wekgcz3l08n2sh8mk5nzvs009nm4ld7zqmq8tvhv7hq47pt8ehh3eqq4tf4k6";
    const decodedBolt = await decodeBolt(bolt11);
    t.true(!!decodedBolt.currency);
    t.false(isNaN(decodedBolt.created_at));
    t.false(decodedBolt.msatoshi === undefined);
    t.true(!!decodedBolt.payment_hash.length);
});
test("Should be able to get invoices and created invoice should be included", async (t) => {
    const { context: { getInvoice, lightingInvoiceLabel } } = t;
    const invoices = await getInvoice();
    t.true(invoices.some(({ label }) => label === lightingInvoiceLabel));
});
test("Should be able to get our nodes peers", async (t) => {
    const { context: { listPeers } } = t;
    const peers = await listPeers();
    t.true(peers.every(p => p.id));
});
test("Should be able no route yet between node and an arbitrary node", async (t) => {
    const { context: { getRoute } } = t;
    const routes = await getRoute("02eadbd9e7557375161df8b646776a547c5cbc2e95b3071ec81553f8ec2cea3b8c", // Peer of LNC
    10, 1);
    t.true(routes.every(route => !!route.every(hop => !!hop.id)));
});
test("Should be able listFunds (outputs and channels)", async (t) => {
    const { context: { listFunds } } = t;
    const funds = await listFunds();
    t.true(!!funds.channels.every(channel => channel.short_channel_id));
    t.true(!!funds.outputs.every(utxo => utxo.txid));
});
test("Should be able list Payments", async (t) => {
    const { context: { listPays } } = t;
    const pays = await listPays();
    t.true(pays.every(p => p.preimage && p.bolt11));
});
