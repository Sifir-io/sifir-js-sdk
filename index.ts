import { client as btcClient } from "./src/clients/cyphernode/btcClient";
import { client as lnClient } from "./src/clients/cyphernode/lncClient";
import { client as otsClient } from "./src/clients/cyphernode/otsClient";
import { client as wasabiClient } from "./src/clients/cyphernode/wasabiClient";
import { client as cnClient } from "./src/clients/cyphernode/cnClient";
import { cypherNodeAuthHelper } from "./src/clients/cyphernode/util/auth";

import { lndHelper as lndAuthHelper } from "./src/clients/lnd/util/auth";
import { client as lndClient } from "./src/clients/lnd/lndClient";

import { clnRestHelper } from "./src/clients/clightning-rest/util/auth";
import { client as clnRestClient } from "./src/clients/clightning-rest/lncClient";
import { BtcUnits, toUnit } from "./src/lib/units";
const cyphernode = {
  btcClient,
  lnClient,
  otsClient,
  wasabiClient,
  cnClient,
  authHelper: cypherNodeAuthHelper
};
const lnd = {
  lndClient,
  lndAuthHelper
};
const clnRest = {
  clnRestClient,
  clnRestHelper
};
const apis = {
  lnd,
  clnRest,
  cyphernode
};

const btcUtils = {
  toUnit,
  BtcUnits
};
import { crypto as cryptoUtils } from "./src/lib/cryptoUtil";
import { pgpUtil } from "./src/lib/pgpUtil";
import { sifirId } from "./src/lib/sifirId";

export { apis, pgpUtil, sifirId, cryptoUtils, btcUtils };
// typpes
export * from "./src/lib/types/sifirId";
export * from "./src/lib/types/clients";
export * from "./src/lib/types/lightning-c";
export * from "./src/lib/types/btc";
export * from "./src/lib/types/pgpUtil";
