import { toUnit, BtcUnits } from "../../lib/units";
import httpTransport from "./util/transportFactory";
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

interface CLnRestPayBoltResult {
  destination: string;
  payment_hash: string;
  created_at: number; //1608323759.68;
  parts: number; //3;
  msatoshi: number; //1000;
  amount_msat: string; //"1000msat";
  msatoshi_sent: number; //  1000;
  amount_sent_msat: string; // "1000msat";
  payment_preimage: string; // "689....c"
  status: string; // "complete";
}
export const client = ({
  transport = httpTransport()
}: ClientConfig = {}): SifirLnClientInterface => {
  const { get, post, delete: del } = transport;
  const api = {
    async getNodeInfo(nodeId?: string): Promise<LnNodeInfo> {
      if (nodeId) {
        const [node] = await get("v1/network/listNode", nodeId);
        return { ...node, id: node.nodeid, address: node.addresses };
      } else {
        const node: LnNodeInfo = await get("v1/getinfo");
        console.error(nodeId, node);
        return node;
      }
    },
    async getConnectionString(): Promise<ConnectionString> {
      const info: LnNodeInfo = await get("v1/getinfo");
      const { address, id } = info;
      if (!address) return "";
      const [{ port, type, address: nodeAddress }] = address;
      return `${id}@${nodeAddress}:${port}`;
    },
    async getNewAddress(): Promise<LnAddress> {
      const { address } = await get("v1/newaddr");
      return address;
    },
    async openAndFundPeerChannel(
      payload: LnConnectAndFundPayload
    ): Promise<LnConnectAndFundResult> {
      await post("v1/peer/connect/", {
        id: payload.peer
      });
      const result: LnConnectAndFundResult = await post(
        "v1/channel/openChannel/",
        {
          id: payload.peer.split("@")[0],
          satoshis: toUnit(payload.msatoshi, BtcUnits.MSAT, BtcUnits.SAT),
          feerate: payload.target_conf,
          minConf: payload.min_confs
        }
      );
      return result;
    },

    async createInvoice(
      invoice: CreateInvoicePayload
    ): Promise<CreatedInvoice> {
      const cIn: CreatedInvoice = await post("v1/invoice/genInvoice/", {
        ...invoice,
        amount: invoice.msatoshi
      });
      return {
        ...cIn,
        id: invoice.label
      };
    },
    async getInvoice(invoiceLabel?: string): Promise<CreatedInvoice[]> {
      const { invoices } = await get("v1/invoice/listInvoices", invoiceLabel);
      return invoices;
    },
    // FIXME 404 ?
    async deleteInvoice(invoiceLabel: string): Promise<CreatedInvoice> {
      const invoice: CreatedInvoice = await del(
        "v1/invoice/delInvoice",
        invoiceLabel
      );
      return invoice;
    },
    decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11> {
      return get("v1/pay/decodePay", bolt11);
    },
    async getRoute(
      nodeId: string,
      amount: number,
      riskFactor = 0
    ): Promise<LnRouteDetails[][]> {
      const route = await get(
        "v1/network/getroute",
        [nodeId, amount].join("/")
      );
      return [route];
    },
    async listPeers(nodeId?: string): Promise<LnListPeersPayload[]> {
      const peers: LnListPeersPayload[] = await get(
        "v1/peer/listPeers",
        nodeId
      );
      return peers;
    },
    listFunds(): Promise<LnListFundsPayload> {
      return get("v1/listfunds");
    },
    async listPays(bolt11?: string): Promise<LnListPaysPayload[]> {
      const { pays } = await get("v1/pay/listpays", bolt11);
      return pays;
    },
    async payBolt11(
      bolt11: string,
      expectedMsatoshi: number,
      expectedDesc?: string
    ): Promise<LnPayBolt11Payload> {
      const payresult: CLnRestPayBoltResult = await post("v1/pay", {
        invoice: bolt11,
        amount: expectedMsatoshi ? expectedMsatoshi : undefined
      });
      // Cln rest doens't return route ?
      return { ...payresult, route: [] };
    },
    withdrawFunds(
      destination: string,
      satoshi: number,
      feerate: string = "normal"
    ): Promise<{ tx: string; txid: string }> {
      return post("v1/withdraw", {
        address: destination,
        satoshis: satoshi,
        feeRate: feerate
      });
    }
    // TODO clighning can do both these but cn non
    //	  keySend()
    //	  listTransactions();
  };
  return api;
};
