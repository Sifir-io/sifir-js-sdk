import cypherNodeHTTPTransport from "../transport/.cypherNodeHttpTransport";
import { ClientConfig } from "../../lib/types/clients";
import {
  ConnectionString,
  LnNodeInfo,
  CreatedInvoice,
  CreateInvoicePayload,
  LnAddress,
  Bolt11String,
  DecodedBolt11,
  SifirLnClientInterface,
  LnConnectAndFundPayload,
  LnConnectAndFundResult,
  LnListPeersPayload,
  LnPayBolt11Payload,
  LnRouteDetails,
  LnListFundsPayload,
  LnListPaysPayload
} from "../../lib/types/lightning-c";

interface LndOpenChannelRequest{
   min_confs?: number;
   spend_unconfirmed?: boolean;
   remote_csv_delay?: number;
   node_pubkey_string: string;
   node_pubkey?: any;
   push_sat?: string;
   target_conf?: number;
   sat_per_byte?: string;
   private?: boolean;
   min_htlc_msat?: string;
   local_funding_amount: string;
   host: string;
   id?: string;
   satoshis?: string;
   announce?: boolean;
   utxos?: string[];

}
export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): SifirLnClientInterface => {
  const { get, post } = transport;
  const api = {
    getNodeInfo(): Promise<LnNodeInfo> {
      return get('v1/graph/node/');
    },
    async getConnectionString(): Promise<ConnectionString> {
      const { connectstring } = await get(SifirLnCommands.GET_CONN_STRING);
      return connectstring;
    },
    async getNewAddress(): Promise<LnAddress> {
      const { address } = await get('/v1/newaddress');
      return address;
    },
    openAndFundPeerChannel(
      payload: LnConnectAndFundPayload
    ): Promise<LnConnectAndFundResult> {
      const channelReq:LndOpenChannelRequest = {
        node_pubkey_string: payload.peer,
        host: payload.peer,
        local_funding_amount: (payload.msatoshi * 1000).toString(),
      }
      return post('/v1/channels',channelReq);
    },

    createInvoice(invoice: CreateInvoicePayload): Promise<CreatedInvoice> {
      return post(SifirLnCommands.CREATE_INVOICE, invoice);
    },
    async getInvoice(invoiceLabel?: string): Promise<CreatedInvoice[]> {
      const { invoices } = await get("ln_getinvoice", invoiceLabel);
      return invoices;
    },
    /** FAILS 403 */
    async deleteInvoice(invoiceLabel?: string): Promise<CreatedInvoice> {
      const invoice = await get("ln_delinvoice", invoiceLabel);
      return invoice;
    },
    decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11> {
      return get("ln_decodebolt11", bolt11);
    },
    async getRoute(
      nodeId: string,
      amount: number,
      riskFactor = 0
    ): Promise<[LnRouteDetails]> {
      const { route } = await get(
        "ln_getroute",
        [nodeId, amount, riskFactor].join("/")
      );
      return route;
    },
    async listPeers(nodeId?: string): Promise<[LnListPeersPayload]> {
      const { peers } = await get("ln_listpeers", nodeId);
      return peers;
    },
    listFunds(): Promise<LnListFundsPayload> {
      return get("ln_listfunds");
    },
    async listPays(bolt11?: string): Promise<[LnListPaysPayload]> {
      const { pays } = await get("ln_listpays");
      return pays;
    },
    async payBolt11(
      bolt11: string,
      expectedMsatoshi?: number,
      expectedDesc?: string
    ): Promise<LnPayBolt11Payload> {
      const payresult = await post("ln_pay", {
        bolt11,
        expected_msatoshi: expectedMsatoshi ? expectedMsatoshi : undefined,
        expected_description: expectedDesc ? expectedDesc : undefined
      });
      return payresult;
    },
    withdrawFunds(
      destination: string,
      satoshi: number,
      feerate: string = "normal"
    ): Promise<any> {
      return post("ln_withdraw", {
        destination,
        satoshi,
        feerate
      });
    }
  };
  return api;
};
