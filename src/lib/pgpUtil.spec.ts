import _debug from "debug";
import { serial, TestInterface } from "ava";
import { pgpUtil as _pgpUtil, SifirPgpUtil } from "./pgpUtil";
import * as _pgp from "openpgp";
const test = serial as TestInterface<SifirPgpUtil>;
const debug = _debug("sifir:pgputilspec");
test.before(t => {
  t.context = {
    ..._pgpUtil()
  };
});
test.skip("Should generate a new PGP key", async t => {
  const { makeNewPgpKey } = t.context;
  const {
    privateKeyArmored,
    publicKeyArmored,
    revocationCertificate
  } = await makeNewPgpKey({
    passphrase: "random pas",
    user: "testuser"
  });
  t.true(!!privateKeyArmored.length);
  t.true(!!publicKeyArmored.length);
  t.true(!!revocationCertificate.length);
});
test("Should be able to init and unlock keys, returning fingerprint, hex and pubkey", async t => {
  const {
    getPubkeyArmored,
    getKeyFingerprint,
    makeNewPgpKey,
    initAndUnlockKeys
  } = t.context;
  const passphrase = "random pas";
  const {
    privatekeyArmored,
    publickeyArmored,
    revocationCertificate
  } = await makeNewPgpKey({
    passphrase,
    user: "testuser"
  });
  const { fingerprint, hexkeyId, pubkeyArmored } = await initAndUnlockKeys({
    privatekeyArmored: privatekeyArmored,
    passphrase
  });
  t.is(fingerprint, await getKeyFingerprint());
  t.is(pubkeyArmored, getPubkeyArmored());
  t.true(!!hexkeyId.length);
});

// FIXME standrazie make new key return types, integration test API register call
// 2. Update RN pgp libb
//
