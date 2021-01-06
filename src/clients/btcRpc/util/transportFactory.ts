import transport from "../../../transport/httpTransport";
import { btcAuthHelper as _authHelper } from "./auth";
export default ({
  rpcUrl = (process && process.env.BTC_RPC_URL) || "https://localhost:8332/",
  rpcCert = (process && process.env.BTC_RPC_CERT) || "",
  proxyUrl = process.env.TOR_PROXY_URL || "",
  btcAuthHelper = _authHelper()
} = {}) => {
  const { customHeaders } = btcAuthHelper;
  return transport({
    gatewayUrl: rpcUrl,
    customHeaders,
    caCert: rpcCert,
    proxyUrl
  });
};
