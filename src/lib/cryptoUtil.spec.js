"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { serial, TestInterface } from "ava";
const ava_1 = require("ava");
const cryptoUtil_1 = require("./cryptoUtil");
const crypto_1 = require("crypto");
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
ava_1.serial("hmacSHA256Hex should generate a hash identifcal to reference fn", async (t) => {
    const { hmacSHA256Hex } = cryptoUtil_1.crypto();
    const text = "Text to hash";
    const key = "SomeKey";
    const hmac = crypto_1.createHmac("sha256", key);
    hmac.update(text);
    const trueHash = hmac.digest("hex");
    const token = await hmacSHA256Hex(text, key);
    t.true(token === trueHash);
});
//test("Cyphernodeclient should generate a valid auth hash", async t => {
//  const apiKey = "somekey";
//  const userType = 3;
//  const { makeToken } = crypto();
//  const token = await makeToken(apiKey, userType);
//  t.is(token.length, 142);
//  const [h64, p64, generatedHash] = token.split(".");
//  // Test generated hash vs reference
//  const hmac = createHmac("sha256", <BinaryType>apiKey);
//  hmac.update(`${h64}.${p64}`);
//  const trueHash = hmac.digest("hex");
//  t.true(generatedHash === trueHash);
//});
ava_1.serial("Sha256 should hash correctly", async (t) => {
    const stringToHash = "my test - some complicated string";
    //$ echo -n "my test - some complicated string"  | sha256sum
    const bashSha256Sum = "672712a7266b213818895feba751c9c90ff37ff8f7ce35d7b359afa9fe16c082";
    const { sha256 } = cryptoUtil_1.crypto();
    t.is(sha256(Buffer.from(stringToHash)), bashSha256Sum);
});
