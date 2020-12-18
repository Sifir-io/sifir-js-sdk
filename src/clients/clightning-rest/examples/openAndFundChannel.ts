import { client } from "../lncClient";
const lnc = client();
(async () => {
  try {
    const balances = await lnc.listFunds();
    console.warn("we have", balances);
    const result = await lnc.openAndFundPeerChannel({
      peer:
        "03d5e17a3c213fe490e1b0c389f8cfcfcea08a29717d50a9f453735e0ab2a7c003@tbtc.ion.radar.tech:9735",
      msatoshi: 20000000
    });
    console.log("Peers", await lnc.listPeers());
    console.warn("Channel result", result);
  } catch (err) {
    console.error("Error", err.response.body);
  }
})();
