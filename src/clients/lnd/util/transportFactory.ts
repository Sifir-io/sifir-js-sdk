import transport from "../../../transport/httpTransport";
import { lndHelper } from "./auth";
const { customHeaders } = lndHelper();
const gatewayUrl =
  (process && process.env.LND_GATEWAY_URL) || "https://localhost:2009/v0/";
const caCert = (process && process.env.LND_CA_CERT) || "";
const proxyUrl = process.env.TOR_PROXY_URL || "";

export default () => transport({ gatewayUrl, customHeaders, caCert, proxyUrl });
