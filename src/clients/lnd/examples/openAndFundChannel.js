"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lndClient_1 = require("../lndClient");
const lnd = lndClient_1.client();
(async () => {
    try {
        const balances = await lnd.listFunds();
        console.warn("we have", balances);
        const result = await lnd.openAndFundPeerChannel({
            peer: "03d5e17a3c213fe490e1b0c389f8cfcfcea08a29717d50a9f453735e0ab2a7c003@tbtc.ion.radar.tech:9735",
            msatoshi: 60000000
        });
        console.log("Peers", await lnd.listPeers());
        console.warn("Channel result", result);
    }
    catch (err) {
        console.error(err.response.body);
    }
})();
