import transport from "../../../transport/httpTransport";
import {cypherNodeAuthHelper} from "./auth";
const {customHeaders} = cypherNodeAuthHelper();

const CypherNodeGatewayUrl =
    (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";
const CypherNodeCertCAPem =
    (process && process.env.CYPHERNODE_GATEKEEPER_CERT_CA) || "";
const TorProxyURL = process.env.TOR_PROXY_URL || "";

export default ()=>transport({gatewayUrl: CypherNodeGatewayUrl,customHeaders,caCert:CypherNodeCertCAPem,proxyUrl:TorProxyURL});
