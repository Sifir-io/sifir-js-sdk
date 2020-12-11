import cypherNodeHTTPTransport from "./util/transportFactory";
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

// TODO finish replacing rest of commands
enum CyphernodeLnCommands {
  GET_INFO = "ln_getinfo",
  GET_CONN_STRING = "ln_getconnectionstring",
  GET_NEW_ADDR = "ln_newaddr",
  CONNECT_FUND = "ln_connectfund",
  CREATE_INVOICE = "ln_create_invoice",
  GET_INVOICES = "ln_getinvoice",
  DEL_INVOICE = "ln_delinvoice",
  DECODE_BOLT = "ln_decodebolt11",
  GET_ROUTE = "ln_getroute",
  LIST_PEERS = "ln_listpeers",
  LIST_FUNDS = "ln_listfunds",
  LIST_PAYMENTS = "ln_listpays",
  PAY_BOLT11 = "ln_pay",
  WITHDRAW = "ln_withdraw"
}

export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): SifirLnClientInterface => {
  const { get, post } = transport;
  const api = {
    // FIXME update this to get 'a' nodes info if id is provided
    // Implement listnodes/nodeId
    //	  https://lightning.readthedocs.io/lightning-listnodes.7.html
    getNodeInfo(nodeId?: string): Promise<LnNodeInfo> {
      return get(CyphernodeLnCommands.GET_INFO);
    },
    async getConnectionString(): Promise<ConnectionString> {
      const { connectstring } = await get(CyphernodeLnCommands.GET_CONN_STRING);
      return connectstring;
    },
    async getNewAddress(): Promise<LnAddress> {
      const { address } = await get(CyphernodeLnCommands.GET_NEW_ADDR);
      return address;
    },
    openAndFundPeerChannel(
      payload: LnConnectAndFundPayload
    ): Promise<LnConnectAndFundResult> {
      return post(CyphernodeLnCommands.CONNECT_FUND, payload);
    },

    createInvoice(invoice: CreateInvoicePayload): Promise<CreatedInvoice> {
      return post(CyphernodeLnCommands.CREATE_INVOICE, invoice);
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
    ): Promise<LnRouteDetails[][]> {
      const { route } = await get(
        "ln_getroute",
        [nodeId, amount, riskFactor].join("/")
      );
      return [route];
    },
    async listPeers(nodeId?: string): Promise<LnListPeersPayload[]> {
      const { peers } = await get("ln_listpeers", nodeId);
      return peers;
    },
    listFunds(): Promise<LnListFundsPayload> {
      return get("ln_listfunds");
    },
    async listPays(bolt11?: string): Promise<LnListPaysPayload[]> {
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
    // TODO clighning can do both these but cn non
    //	  keySend()
    //	  listTransactions();
  };
  return api;
};
