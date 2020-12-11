"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This example will fetch all your watched Pub32 from Cyphernode and their balances , and then print them out in a simple console output
 */
const lncClient_1 = require("../lncClient");
(async () => {
    try {
        const { createInvoice } = lncClient_1.client();
        const invoice = await createInvoice({
            label: "My CN inovice",
            description: "An invoice",
            expiry: Date.now() + 60 * 60 * 1000,
            callback_url: null,
            msatoshi: 0
        });
        console.log("invoice", invoice);
    }
    catch (err) {
        console.error(err);
        process.exit();
    }
})();
