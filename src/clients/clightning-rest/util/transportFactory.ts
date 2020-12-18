import transport from "../../../transport/httpTransport";
import { clnRestHelper as _authHelper } from "./auth";

export default ({
  gatewayUrl = (process && process.env.CLNREST_GATEWAY_URL) ||
    "https://localhost:3003/",
  caCert = (process && process.env.CLNREST_CA_CERT) || "",
  proxyUrl = process.env.TOR_PROXY_URL || "",
  clnrestHelper = _authHelper()
} = {}) => {
  const { customHeaders } = clnrestHelper;
  return transport({ gatewayUrl, customHeaders, caCert, proxyUrl });
};
