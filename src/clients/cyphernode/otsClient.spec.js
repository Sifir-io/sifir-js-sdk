"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ava_1 = require("ava");
const otsClient_1 = require("./otsClient");
const test = ava_1.serial;
test.before(t => {
    t.context = {
        fileHash: crypto_1.createHash("sha256")
            .update(`${Date.now}:${parseInt(Math.random() * 100)}`)
            .digest("hex"),
        ...otsClient_1.client()
    };
});
test("Should be able to generate an OTS file", async (t) => {
    const { context: { stamp, fileHash } } = t;
    const hashRcpt = await stamp(fileHash);
    t.true(hashRcpt.hash === fileHash);
    t.false(isNaN(hashRcpt.id));
    t.is(hashRcpt.result, "success");
});
test("Should be able to Verify an OTS file hash", async (t) => {
    const { context: { verifyFileStamp, fileHash } } = t;
    const { method, hash, result, message } = await verifyFileStamp(fileHash);
    t.is(hash, fileHash);
    t.true(result === "pending" || result === "completed");
});
test("Should be able to get OTS stamp", async (t) => {
    const { context: { getStamp, fileHash } } = t;
    const poop = await getStamp(fileHash);
    t.pass(poop);
});
