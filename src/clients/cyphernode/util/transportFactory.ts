import transport from "../../../transport/httpTransport";
import { cypherNodeAuthHelper as _authHelper } from "./auth";
export default ({
  CypherNodeGatewayUrl = (process && process.env.CYPHER_GATEWAY_URL) ||
    "https://localhost:2009/v0/",
  CypherNodeCertCAPem = (process &&
    process.env.CYPHERNODE_GATEKEEPER_CERT_CA) ||
    "",
  TorProxyURL = process.env.TOR_PROXY_URL || "",
  cypherNodeAuthHelper = _authHelper()
} = {}) => {
  const { customHeaders } = cypherNodeAuthHelper;
  return transport({
    gatewayUrl: CypherNodeGatewayUrl,
    customHeaders,
    caCert: CypherNodeCertCAPem,
    proxyUrl: TorProxyURL
  });
};
