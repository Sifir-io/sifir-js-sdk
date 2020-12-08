import _debug from "debug";
import { serial, TestInterface } from "ava";
import { pgpUtil as _pgpUtil } from "./pgpUtil";
import {SifirPgpUtil} from "./types/pgpUtil";
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
    privkeyArmored,
    pubkeyArmored,
    revocationCertificate
  } = await makeNewPgpKey({
    passphrase: "random pas",
    user: "testuser"
  });
  t.true(!!privkeyArmored.length);
  t.true(!!pubkeyArmored.length);
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
