import { sifirId } from "../../../lib/sifirId";
import { pgpUtil } from "../../../lib/pgpUtil";
const user = process.env.SIFIR_ID_USER;
const passphrase = process.env.SIFIR_ID_KEY_PASS;
const idServerUrl = process.env.SIFIR_ID_SERVER_URL;

(async () => {
  console.log("Starting with", user, passphrase, idServerUrl);
  if (!user || !passphrase) throw "Missing user pass ENV vars";
  const pgp = pgpUtil();
  const { pubkeyArmored, privkeyArmored } = await pgp.makeNewPgpKey({
    user,
    passphrase
  });
  console.log("Generated key", privkeyArmored);
  pgp.initAndUnlockKeys({ privkeyArmored, passphrase });
  const sifir = sifirId({ pgpLib: pgp, idServerUrl });
  const registrationResult = await sifir.registerUserKey({ user });
  console.log("Registered user!");
})();
