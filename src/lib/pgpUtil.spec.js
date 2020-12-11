"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const ava_1 = require("ava");
const pgpUtil_1 = require("./pgpUtil");
const test = ava_1.serial;
const debug = debug_1.default("sifir:pgputilspec");
test.before(t => {
    t.context = {
        ...pgpUtil_1.pgpUtil()
    };
});
test.skip("Should generate a new PGP key", async (t) => {
    const { makeNewPgpKey } = t.context;
    const { privkeyArmored, pubkeyArmored, revocationCertificate } = await makeNewPgpKey({
        passphrase: "random pas",
        user: "testuser"
    });
    t.true(!!privkeyArmored.length);
    t.true(!!pubkeyArmored.length);
    t.true(!!revocationCertificate.length);
});
test("Should be able to init and unlock keys, returning fingerprint, hex and pubkey", async (t) => {
    const { getPubkeyArmored, getKeyFingerprint, makeNewPgpKey, initAndUnlockKeys } = t.context;
    const passphrase = "random pas";
    const { privkeyArmored, revocationCertificate } = await makeNewPgpKey({
        passphrase,
        user: "testuser"
    });
    const { fingerprint, hexkeyId, pubkeyArmored } = await initAndUnlockKeys({
        privkeyArmored: privkeyArmored,
        passphrase
    });
    t.is(fingerprint, await getKeyFingerprint());
    t.is(pubkeyArmored, getPubkeyArmored());
    t.true(!!hexkeyId.length);
});
