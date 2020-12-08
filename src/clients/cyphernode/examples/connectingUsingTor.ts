/**
 * A simple example showing how easy it is to connect to your Cyphernode behind a proxy (Ex. Tor) using the SDK
 * by simply injecting the proxied transport into the client of your choice
 * Make sure the following env variables are set:
    // Gatekeeper onion
    CYPHER_GATEWAY_URL
   // Cyphernode Cert
    CYPHERNODE_GATEKEEPER_CERT_CA) || "";
   // Socks5 endpoint
   TOR_PROXY_URL
 */
import { client as btcClient } from "../btcClient";
import httpTransport from "../util/transportFactory";
(async () => {
  try {
    // Setup the transport proxyUrl
    //
    const transport = httpTransport();
    // Inject the transport the btcclient (or whatever client you want to instantiate)
    const client = btcClient({ transport });
    const bestBlockInfo = await client.getBestBlockInfo();
    console.log(
      "I got the best block info through a socks proxy !",
      bestBlockInfo
    );
  } catch (err) {
    console.error("I pooped", err);
  }
})();
