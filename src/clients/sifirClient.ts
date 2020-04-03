import { RestfulTransport } from "../lib/types/clients";
import {
  ConnectionString,
  LnNodeInfo,
  CreatedInvoice,
  CreateInvoicePayload,
  LnAddress,
  Bolt11String,
  DecodedBolt11,
  CypherNodeLncClient,
  LnConnectAndFundPayload,
  LnConnectAndFundResult,
  LnListPeersPayload,
  LnPayBolt11Payload,
  LnRouteDetails,
  LnListFundsPayload,
  LnListPaysPayload
} from "../lib/types/lightning-c";
export interface SifirGetLnWalletSnapshotPayload {
  funds: LnListFundsPayload;
  invoices: CreatedInvoice;
  payments: LnListPaysPayload;
}
export interface SifirClient {
  getBtcWalletSnapshot(param): Promise<LnNodeInfo>;
  getLnWalletSnapshot(param): Promise<SifirGetLnWalletSnapshotPayload>;
}
export const client = (transport: RestfulTransport): SifirClient => {
  const { get, post } = transport;
  const api = {
    getBtcWalletSnapshot(param): Promise<LnNodeInfo> {
      return get("sifirGetBtcWalletSnapshot", param);
    },
    getLnWalletSnapshot(param): Promise<SifirGetLnWalletSnapshotPayload> {
      return get("sifirGetLnWalletSnapshot", param);
    }
  };
  return api;
};
