import btcRpcTransport from "./util/transportFactory";
import { ClientConfig } from "../../lib/types/clients";
import {
  SifirBtcClient,
  Hash,
  BlockInfo,
  TxnInfo,
  TxnWatchConfimation,
  TxnWatchOptions,
  Address,
  AddressType,
  AddressWatchConfirmation,
  AddressWatchPayload,
  GenericWatchResponse,
  WatcherOptions,
  Pub32WatcherOptions,
  Pub32AddressWatchPayload,
  Pub32WatchConfirmation,
  WatchPub32UnusedAddress,
  WatchedPub32,
  WatchPub32Txn,
  BlockChainInfo,
  SpendConfirmation,
  SpenderGetTxnResult,
  BumpfeeResp
} from "../../lib/types/btc";
export const client = ({
  transport = btcRpcTransport()
}: ClientConfig = {}): SifirBtcClient => {
  const { post } = transport;
  // override get method from http transport to duck data into btccore rpc's post request format
  const get = (method: String, param?: any): Promise<any> =>
    post("/", {
      jsonrpc: "1.0",
      id: "1",
      method,
      params: param || []
    });

  const api = {
    /** Core and Spending */
    async getBlockChainInfo(): Promise<BlockChainInfo> {
      const { result } = await get("getblockchaininfo");
      return result;
    },
    async getNewAddress(
      type: AddressType = "p2sh-segwit",
      label = ""
    ): Promise<Address> {
      const { result: address } = await get("getnewaddress", [label, type]);
      return address;
    },
    async getBlockHash(height: number): Promise<Hash> {
      const { result: blockHash } = await get("getblockhash", [height]);
      return blockHash;
    },

    async getBestBlockHash(): Promise<Hash> {
      const { result: blockHash } = await get("getbestblockhash");
      return blockHash;
    },
    async getBestBlockInfo(): Promise<BlockInfo> {
      const blockHash = await api.getBestBlockHash();
      return await api.getBlockInfo(blockHash);
    },
    async getBlockInfo(blockHash: Hash): Promise<BlockInfo> {
      const { result: blockInfo } = await get("getblock", [blockHash]);
      return blockInfo;
    },
    async getTxn(txnHash: Hash): Promise<TxnInfo> {
      const { result: txnInfo } = await get("gettransaction", [txnHash]);
      return txnInfo;
    },
    async getBalance(): Promise<number> {
      const { result: balance } = await get("getbalance");
      return balance;
    },
    async getTxnsSpending(
      count = 10,
      skip = 0,
      label = "*"
    ): Promise<[SpenderGetTxnResult]> {
      const { result: txns } = await get("listtransactions", [
        label,
        count,
        skip
      ]);
      return txns;
    },
    async spend(
      address: Address,
      amount: number,
      confTarget = 6,
      replaceable = true,
      subtractFee = false,
      txnComment = "",
      toComment = ""
    ): Promise<SpendConfirmation> {
      const result: SpendConfirmation = await post("sendtoaddress", {
        address,
        amount,
        txnComment,
        toComment,
        subtractFee,
        replaceable,
        confTarget
      });
      return result;
    },
    async bumpTxnFee(
      txnId: string,
      confTarget: number = 0,
      totalFee: number = 0
    ): Promise<BumpfeeResp> {
      throw "Please provide a confTarget or totalFee";
      const { result } = await post("bumpfee", [
        txnId,
        {
          confTarget: confTarget > 0 ? confTarget : undefined,
          totalFee: totalFee > 0 ? totalFee : undefined
        }
      ]);
      return result;
    },
    // FIXME HERE BELOW THIS DO WE DO WATCHING OF BTC PAIRINGS OR NOT NOW ?
    /** Txn and Address watch & unwatch */
    async watchTxnId(
      txn: string,
      options: TxnWatchOptions
    ): Promise<TxnWatchConfimation> {
      let param = {
        nbxconf: 6,
        ...options
      };
      const result = await post("watchtxid", { txid: txn, ...param });
      return result;
    },
    async watchAddress(
      address: Address,
      options?: WatcherOptions
    ): Promise<AddressWatchConfirmation> {
      const result = await post("watch", {
        address,
        ...options
      });
      return result;
    },
    async getActiveAddressWatch(): Promise<[AddressWatchPayload]> {
      const { watches } = await get("getactivewatches");
      return watches;
    },
    async unwatchAddress(address: Address): Promise<AddressWatchConfirmation> {
      const result = await get("unwatch", address);
      return result;
    },
    /** Pub32 watch & unwatch */
    async watchPub32(
      xpub: string,
      options: Pub32WatcherOptions
    ): Promise<Pub32WatchConfirmation> {
      if (!options.label) throw "Label is required to for a pub32 watch";
      if (/[^0-9a-zA-Z_i ]/.test(options.label))
        throw "Labels must be alpha numeric or _";
      if (!options.nstart || isNaN(options.nstart))
        throw "nstart must be provided and must be a number";
      const result = await post("watchxpub", {
        pub32: xpub,
        ...options
      });
      return result;
    },
    async getWatchedAddressesByPub32(
      xpub: string
    ): Promise<[Pub32AddressWatchPayload]> {
      const { watches } = await get("getactivewatchesbyxpub", xpub);
      return watches;
    },
    async getWatchedAddressesByPub32Label(
      label: string
    ): Promise<[Pub32AddressWatchPayload]> {
      const { watches } = await get("getactivewatchesbylabel", label);
      return watches;
    },
    async getWatchedPub32(): Promise<[WatchedPub32]> {
      const { watches } = await get("getactivexpubwatches");
      return watches;
    },
    async unwatchPub32(xpub: string): Promise<AddressWatchConfirmation> {
      const result = await get("unwatchxpubbyxpub", xpub);
      return result;
    },
    async unwatchPub32ByLabel(label: string): Promise<GenericWatchResponse> {
      const result = await get("unwatchxpubbylabel", label);
      return result;
    },
    /** Pub32 Balance */
    async getBalanceByPub32(xpub: string): Promise<string> {
      const { balance } = await get("getbalancebyxpub", xpub);
      return balance;
    },
    async getBalanceByPub32Label(label: string): Promise<string> {
      const { balance } = await get("getbalancebyxpublabel", label);
      return balance;
    },
    async getUnusedAddressesByPub32Label(
      label: string,
      count = 10
    ): Promise<[WatchPub32UnusedAddress]> {
      const { label_unused_addresses } = await get(
        "get_unused_addresses_by_watchlabel",
        [label, count].join("/")
      );
      return label_unused_addresses;
    },
    async getTransactionsByPub32Label(
      label: string,
      count = 10
    ): Promise<[WatchPub32Txn]> {
      const { label_txns } = await get(
        "get_txns_by_watchlabel",
        [label, count].join("/")
      );
      return label_txns;
    }
  };
  return api;
};
