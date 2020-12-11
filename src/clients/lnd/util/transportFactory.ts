import transport from "../../../transport/httpTransport";
import { lndHelper as _authHelper } from "./auth";

export default ({
  gatewayUrl = (process && process.env.LND_GATEWAY_URL) ||
    "https://localhost:3007/",
  caCert = (process && process.env.LND_CA_CERT) || "",
  proxyUrl = process.env.TOR_PROXY_URL || "",
  lndHelper = _authHelper()
} = {}) => {
  const { customHeaders } = lndHelper;
  return transport({ gatewayUrl, customHeaders, caCert, proxyUrl });
};
