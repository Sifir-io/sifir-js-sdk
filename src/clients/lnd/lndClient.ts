import httpTransport from "./util/transportFactory";
import { shallowAsQueryParam } from "../../transport/util";
import { crypto } from "../../lib/cryptoUtil";
import { toUnit, BtcUnits } from "../../lib/units";
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
  LnListPaysPayload,
  LnInvoiceFilters,
  LnPayFilters
} from "../../lib/types/lightning-c";
import {
  LndChannelResult,
  LnDCreatedInvoice,
  LnDCreateInvoice,
  LnDDecodedBolt11,
  LndGraphNodeInfo,
  LndInvoice,
  LndListPaysResult,
  LndNodeInfo,
  LndOpenChannelRequest,
  LndOpenFundChannelResp,
  LndPayInvoiceResult,
  LnDPeer,
  LndRouteDetails,
  LndUtxo
} from "../../lib/types/lnd";

/**
 * Duck an LndInvoice into CreatedInvoice
 */
const invoiceDuck = (i: LndInvoice): CreatedInvoice => ({
  id: i.add_index,
  label: i.memo,
  msatoshi: parseInt(i.value_msat),
  status: i.state === 1 ? "paid" : "unpaid",
  bolt11: i.payment_request,
  payment_address: i.payment_addr,
  payment_hash: i.r_preimage
});
/** Pay Invoice duck it LndInvoice */
const payInoviceDuck = ({
  result
}: {
  result: LndPayInvoiceResult;
}): LnPayBolt11Payload => ({
  payment_hash: result.payment_hash,
  msatoshi: parseInt(result.value_msat),
  msatoshi_sent: parseInt(result.value_msat),
  created_at: parseInt(result.creation_date),
  status: result.status,
  payment_preimage: result.payment_preimage,
  bolt11: result.payment_request,
  route: result.htlcs
});
/* Payment list duck*/
const paymentLisitingDuck = (p: LndListPaysResult): LnListPaysPayload => {
  return {
    bolt11: p.payment_request,
    // LnListPaysPayload is the same an Lnd but lowercase
    status: p.status.toLowerCase(),
    amount_sent_msat: p.value_msat,
    preimage: p.payment_preimage
  };
};
const { sha256 } = crypto();
export const client = ({
  transport = httpTransport()
} = {}): SifirLnClientInterface => {
  const { get, post } = transport;
  const api = {
    async getNodeInfo(nodeId?: string): Promise<LnNodeInfo> {
      if (nodeId) {
        const info: LndGraphNodeInfo = await get("v1/graph/node", nodeId);
        return {
          id: info.node.pub_key,
          alias: info.node.alias,
          color: info.node.color,
          num_active_channels: info.num_channels,
          address: info.node.addresses.map(({ network, addr }) => {
            const [address, port] = addr.split(":");
            return {
              type: network,
              address,
              port
            };
          })
        };
      } else {
        const info: LndNodeInfo = await get("v1/getinfo");
        return {
          id: info.identity_pubkey,
          alias: info.alias,
          color: info.color,
          // TODO update this
          address: info.uris,
          num_peers: info.num_peers,
          num_pending_channels: info.num_pending_channels,
          num_active_channels: info.num_active_channels,
          num_inactive_channels: info.num_inactive_channels,
          version: info.version,
          blockheight: info.block_height,
          network: info.chains.chain
        };
      }
    },
    // FIXME how do we get the nodes adddress ? i think its in URI ..
    async getConnectionString(): Promise<ConnectionString> {
      `id@address:port`;
      // FIMXE
      const { connectstring } = await get("v1/getinfo");
      return connectstring;
    },
    async getNewAddress(): Promise<LnAddress> {
      const { address } = await get("v1/newaddress");
      return address;
    },
    async openAndFundPeerChannel(
      payload: LnConnectAndFundPayload
    ): Promise<LnConnectAndFundResult> {
      // connect to peer
      const [pubkey, host] = payload.peer.split("@");
      if (!pubkey || !host)
        throw "Unable to parse peer string must be of forst <pubkey>@<host>";

      try {
        await post("v1/peers", {
          addr: { pubkey, host },
          perm: true,
          timeout: 30
        });
      } catch (err) {
        if (!err.response.body.error.startsWith("already connected to peer")) {
          throw err;
        }
      }
      // If we have a sat_per_byte use it
      // otherwise check if we have a conf target, if not default to 2
      const feeTarget: { sat_per_byte?: number; target_conf?: number } = {};
      if (payload.sat_per_byte) {
        feeTarget.sat_per_byte = payload.sat_per_byte;
      } else {
        feeTarget.target_conf = payload.target_conf || 2;
      }

      // open channel
      // TODO conditional type to fix ts error
      const channelReq: LndOpenChannelRequest = {
        node_pubkey_string: pubkey,
        host,
        local_funding_amount: toUnit(
          payload.msatoshi,
          BtcUnits.MSAT,
          BtcUnits.SAT
        ).toString(),
        ...feeTarget
      };
      const resp: LndOpenFundChannelResp = await post(
        "v1/channels",
        channelReq
      );
      return {
        result: "success",
        txid: Buffer.from(resp.funding_txid_bytes, "hex").toString("base64")
      };
    },

    async createInvoice(
      invoice: CreateInvoicePayload
    ): Promise<CreatedInvoice> {
      let lndInvoiceReq: LnDCreateInvoice = {
        value_msat: invoice.msatoshi.toString(),
        amt_paid_msat: invoice.msatoshi.toString(),
        expiry: invoice.expiry.toString(),
        memo: invoice.label,
        add_index: 1
      };
      const result: LnDCreatedInvoice = await post(
        "v1/invoices",
        lndInvoiceReq
      );
      return {
        id: result.add_index.toString(),
        payment_address: result.payment_addr,
        payment_hash: result.r_hash,
        label: invoice.description,
        bolt11: result.payment_request
      };
    },
    async getInvoice(
      invoiceFilters?: LnInvoiceFilters
    ): Promise<CreatedInvoice[]> {
      if (invoiceFilters && invoiceFilters.paymentHash) {
        let { paymentHash } = invoiceFilters;
        if (!paymentHash) {
          throw "Cannot get lnd invoice without paymentHash";
        }
        const invoice: LndInvoice = await get("v1/invoice", paymentHash);
        return [invoiceDuck(invoice)];
      } else {
        let lndFilters = {
          pending_only:
            (invoiceFilters && invoiceFilters.pendingOnly) || undefined,
          index_offset:
            (invoiceFilters && invoiceFilters.indexOffset) || undefined,
          // default to max 20
          num_max_invoices: (invoiceFilters && invoiceFilters.limit) || 20,
          // default to reverse
          reversed:
            invoiceFilters && invoiceFilters.order
              ? invoiceFilters.order === -1
              : true
        };
        const { invoices }: { invoices: LndInvoice[] } = await get(
          `v1/invoices?${shallowAsQueryParam(lndFilters)}`
        );
        return invoices.map(invoiceDuck);
      }
    },
    async decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11> {
      const result: LnDDecodedBolt11 = await get("v1/payreq", bolt11);
      return {
        currency: "bc",
        created_at: parseInt(result.timestamp),
        expiry: parseInt(result.expiry),
        msatoshi: parseInt(result.num_msat),
        description: result.description,
        payee: result.destination,
        min_final_cltv_expiry: parseInt(result.cltv_expiry),
        payment_hash: result.payment_hash
        // signature: string; // "3045022100c32b5bfc445313971035cd4797e08ee0d73c041c2cacc69a4771d8d828112bc202202078bdf35f64b164f056aa8da7e0111";
      };
    },
    async getRoute(
      nodeId: string,
      amount: number,
      riskFactor = 0
    ): Promise<LnRouteDetails[][]> {
      const { routes }: { routes: LndRouteDetails[] } = await get(
        "v1/graph/routes",
        [nodeId, amount].join("/")
      );
      return routes.map<LnRouteDetails[]>(r =>
        r.hops.map(h => ({
          id: h.pub_key,
          channel: h.chan_id,
          amount_msat: h.amt_to_forward_msat,
          fee: h.fee_msat
        }))
      );
    },
    async listPeers(nodeId?: string): Promise<LnListPeersPayload[]> {
      const { peers }: { peers: LnDPeer[] } = await get("v1/peers");
      return peers.map(p => ({
        id: p.pub_key,
        netaddr: [p.address],
        features: p.features,
        ping: parseInt(p.ping_time),
        log: p.errors
      }));
    },
    async listFunds(): Promise<LnListFundsPayload> {
      const [{ channels }, { utxos }]: [
        { channels: LndChannelResult[] },
        { utxos: LndUtxo[] }
      ] = await Promise.all([
        get("v1/channels"),
        get("v1/utxos?min_confs=0&max_confs=9999")
      ]);
      // console.error("sssss", channels, utxos);
      return {
        outputs: utxos.map(utxo => ({
          txid: utxo.outpoint.txid_str,
          output: utxo.outpoint.output_index,
          poop: utxo.amount_sat,
          value: toUnit(utxo.amount_sat, BtcUnits.SAT, BtcUnits.BTC),
          amount_msat: toUnit(
            utxo.amount_sat,
            BtcUnits.SAT,
            BtcUnits.MSAT
          ).toString(),
          address: utxo.address,
          confirmations: parseInt(utxo.confirmations),
          status: parseInt(utxo.confirmations) > 2 ? "confirmed" : "unconfirmed"
        })),
        channels: channels.map(channel => {
          const [txid, output] = channel.channel_point.split(":");
          return {
            peer_id: channel.remote_pubkey,
            connected: channel.active,
            state: channel.chan_status_flags,
            short_channel_id: channel.chan_id,
            channel_sat: parseInt(channel.capacity),
            our_amount_msat: toUnit(
              channel.local_balance,
              BtcUnits.SAT,
              BtcUnits.MSAT
            ),
            channel_total_sat: channel.capacity,
            funding_txid: txid,
            funding_output: output
          };
        })
      };
    },
    async listPays(filters?: LnPayFilters): Promise<LnListPaysPayload[]> {
      const { payments }: { payments: LndListPaysResult[] } = await get(
        `v1/payments${filters ? "?" + shallowAsQueryParam(filters) : ""}`
      );
      return payments.map(paymentLisitingDuck);
    },
    async payBolt11(
      bolt11: string,
      expectedMsatoshi: number,
      expectedDesc?: string
    ): Promise<LnPayBolt11Payload> {
      try {
        const payresult: { result: LndPayInvoiceResult } = await post(
          "v2/router/send",
          {
            payment_request: bolt11,
            timeout_seconds: 30,
            amt_msat: expectedMsatoshi ? expectedMsatoshi : undefined
          }
        );
        return payInoviceDuck(payresult);
      } catch (err) {
        // Lnd returns multiple json objects in the payload which superagent detects as invalid json
        // here we check the resp code === 200 ? if so try to parse the json
        // by spliting the repsonse by new line and converting into a JSON array
        if (err.statusCode === 200 && err.rawResponse) {
          try {
            return err.rawResponse
              .split("\n")
              .map(x => x.trim())
              .filter(x => x!!)
              .map(JSON.parse)
              .map(payInoviceDuck);
          } catch (err) {
            console.warn(
              "payBolt11 failed attempt to manually parse rawResponse",
              err
            );
          }
        }
        throw err;
      }
    },
    // POST v1/transactions
    withdrawFunds(
      destination: string,
      satoshi: number,
      // TODO feerate, we should change this to
      // target_conf and fee_rate for consistency
      feerate: string = "normal"
    ): Promise<{ txid: string }> {
      let target_conf: number;
      switch (feerate) {
        case "slow":
          target_conf = 30;
          break;
        case "urgent":
          target_conf = 1;
          break;

        case "normal":
        default:
          target_conf = 4;
          break;
      }

      return post("v1/transactions", {
        addr: destination,
        amount: satoshi,
        target_conf
      });
    }
    // TODO clighning can do both these but cn non
    //	  keySend()
    //	  listTransactions();
  };
  return api;
};
