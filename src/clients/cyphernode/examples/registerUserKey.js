"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sifirId_1 = require("../../../lib/sifirId");
const pgpUtil_1 = require("../../../lib/pgpUtil");
const user = process.env.SIFIR_ID_USER;
const passphrase = process.env.SIFIR_ID_KEY_PASS;
const idServerUrl = process.env.SIFIR_ID_SERVER_URL;
(async () => {
    console.log("Starting with", user, passphrase, idServerUrl);
    if (!user || !passphrase)
        throw "Missing user pass ENV vars";
    const pgp = pgpUtil_1.pgpUtil();
    const { pubkeyArmored, privkeyArmored } = await pgp.makeNewPgpKey({
        user,
        passphrase
    });
    console.log("Generated key", privkeyArmored);
    pgp.initAndUnlockKeys({ privkeyArmored, passphrase });
    const sifir = sifirId_1.sifirId({ pgpLib: pgp, idServerUrl });
    const registrationResult = await sifir.registerUserKey({ user });
    console.log("Registered user!");
})();
