import { client as btcClient } from "./src/clients/cyphernode/btcClient";
import { client as lnClient } from "./src/clients/cyphernode/lncClient";
import { client as otsClient } from "./src/clients/cyphernode/otsClient";
import { client as wasabiClient } from "./src/clients/cyphernode/wasabiClient";
import { client as cnClient } from "./src/clients/cyphernode/cnClient";
import {cypherNodeAuthHelper} from "./src/clients/cyphernode/util/auth"
const cyphernode = {
  btcClient,
  lnClient,
  otsClient,
  wasabiClient,
  cnClient,
  authHelper: cypherNodeAuthHelper
}
import { crypto as cryptoUtils } from "./src/lib/cryptoUtil";
import { pgpUtil } from "./src/lib/pgpUtil";
import { sifirId } from "./src/lib/sifirId";

export {cyphernode,pgpUtil,sifirId,cryptoUtils}
// typpes
export * from "./src/lib/types/sifirId";
export * from "./src/lib/types/pgpUtil";
