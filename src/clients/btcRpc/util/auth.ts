import { Buffer } from "buffer";
import { crypto } from "../../../lib/cryptoUtil";

const { hmacSHA256Hex } = crypto();
const btcAuthHelper = ({
  rpcUser = (process && process.env.BTC_RPC_USER) || undefined,
  rpcPass = (process && process.env.BTC_RPC_PASS) || undefined
} = {}) => {
  if (!rpcUser || !rpcPass) throw "btcAuthHelper missing rpcUser or rpcPass";

  const customHeaders = async ({
    command,
    payload
  }: {
    command: string;
    payload: string;
  }) => {
    let headers = {
      Authorization: `Basic ${Buffer.from(rpcUser + ":" + rpcPass).toString(
        "base64"
      )}`
    };
    return headers;
  };

  return { customHeaders };
};
export { btcAuthHelper };
