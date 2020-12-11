"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const btcClient_1 = require("../btcClient");
const transportFactory_1 = __importDefault(require("../util/transportFactory"));
(async () => {
    try {
        // Setup the transport proxyUrl
        //
        const transport = transportFactory_1.default();
        // Inject the transport the btcclient (or whatever client you want to instantiate)
        const client = btcClient_1.client({ transport });
        const bestBlockInfo = await client.getBestBlockInfo();
        console.log("I got the best block info through a socks proxy !", bestBlockInfo);
    }
    catch (err) {
        console.error("I pooped", err);
    }
})();
