// import { serial, TestInterface } from "ava";
import { serial as test } from "ava";
import { crypto } from "./cryptoUtil";
import { createHmac } from "crypto";
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
test("hmacSHA256Hex should generate a hash identifcal to reference fn", async t => {
  const { hmacSHA256Hex } = crypto();
  const text = "Text to hash";
  const key = "SomeKey";
  const hmac = createHmac("sha256", key);
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
test("Sha256 should hash correctly", async t => {
  const stringToHash = "my test - some complicated string";
  //$ echo -n "my test - some complicated string"  | sha256sum
  const bashSha256Sum =
    "672712a7266b213818895feba751c9c90ff37ff8f7ce35d7b359afa9fe16c082";
  const { sha256 } = crypto();
  t.is(sha256(Buffer.from(stringToHash)), bashSha256Sum);
});
