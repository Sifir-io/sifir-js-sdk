export interface LndOpenChannelRequest {
  min_confs?: number;
  spend_unconfirmed?: boolean;
  remote_csv_delay?: number;
  node_pubkey_string: string;
  // not in docs but is indeed needed..
  host: string;
  node_pubkey?: string; // base64 enoded;
  push_sat?: string;
  //  either target_conf or sat_per_byte
  target_conf?: number;
  sat_per_byte: string;
  private?: boolean;
  min_htlc_msat?: string;
  local_funding_amount: string;
  id?: string;
  satoshis?: string;
  announce?: boolean;
  utxos?: string[];
}

export interface LndGraphNodeInfo {
  node: {
    last_update: number;
    pub_key: string;
    alias: string;
    addresses: { network: string; addr: string }[];
    color: string;
    features: any;
  };
  num_channels: number;
  total_capacity: string;
  channels: any[]; // TODO lnrpcChannelEdge
}
export interface LndNodeInfo {
  version: string;
  commit_hash: string;
  identity_pubkey: string;
  alias: string;
  color: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  num_peers: number;
  block_height: number;
  block_hash: string;
  best_header_timestamp: string;
  synced_to_chain: boolean;
  synced_to_graph: boolean;
  testnet?: boolean;
  chains: {
    chain: "bitcoin";
    network: "testnet" | "regtest" | "mainnet";
  };
  uris?: string[];
  features?: any;
}
export interface LndOpenFundChannelResp {
  funding_txid_bytes: string; // hex<byte>,
  funding_txid_str: string; //string,
  output_index: number;
}
export interface LnDCreateInvoice {
  memo: string;
  value_msat: string;
  expiry: string;
  amt_paid_msat: string;
  add_index: number;
  description_hash?: string;
}
export interface LnDCreatedInvoice {
  r_hash: string; // <byte>,
  payment_request: string;
  add_index: number;
  payment_addr: string; //<byte>,
}
export interface LnDDecodedBolt11 {
  destination: string;
  payment_hash: string;
  num_satoshis: string;
  timestamp: string;
  expiry: string;
  description: string;
  description_hash: string;
  fallback_addr: string;
  cltv_expiry: string;
  route_hints: string[]; //<array lnrpcRouteHint>,
  payment_addr: string;
  num_msat: string;
  features: any; // <object,
}

export interface LndInvoice {
  memo: string;
  r_preimage: string;
  r_hash: string; // base64,
  value: string;
  value_msat: string;
  settled: boolean;
  creation_date: string;
  settle_date: string;
  payment_request: string;
  description_hash: string; // base64,
  expiry: string;
  fallback_addr: string;
  cltv_expiry: string;
  route_hints: string[]; // <array lnrpcRouteHint>,
  private: boolean;
  add_index: string;
  settle_index: string;
  amt_paid: string;
  amt_paid_sat: string;
  amt_paid_msat: string;
  state: LndInvoiceState; // <InvoiceInvoiceState>,
  htlcs: any; // <array lnrpcInvoiceHTLC>,
  features: any; //<object>,
  is_keysend: boolean;
  payment_addr: string; // base64,
}

export enum LndInvoiceState {
  OPEN,
  SETTLED,
  CANCELED,
  ACCEPTED
}
export enum LndPeerSyncType {
  UNKNOWN_SYNC,
  ACTIVE_SYNC,
  PASSIVE_SYNC
}
export interface LnDPeer {
  pub_key: string;
  address: string;
  bytes_sent: string;
  bytes_recv: string;
  sat_sent: string;
  sat_recv: string;
  inbound: boolean;
  ping_time: string;
  sync_type: LndPeerSyncType;
  features: object;
  errors: { timestamp: number; error: string }[];
  flap_count: number;
  last_flap_ns: string;
}
export interface LndHop {
  chan_id: string;
  chan_capacity: string;
  expiry: string;
  amt_to_forward_msat: string;
  fee_msat: string;
  pub_key?: string;
}
export interface LndRouteDetails {
  total_time_lock: number;
  total_fees: string;
  total_amt: string;
  hops: LndHop[];
  total_fees_msat: string;
  total_amt_msat: string;
}
export interface LndAmount {
  sat: string;
  msat: string;
}
export interface LndListFundsResult {
  local_balance: LndAmount;
  remote_balance: LndAmount;
  unsettled_local_balance: LndAmount;
  unsettled_remote_balance: LndAmount;
  pending_open_local_balance: LndAmount;
  pending_open_remote_balance: LndAmount;
}
export interface LndChannelResult {
  active: boolean;
  remote_pubkey: string;
  channel_point: string;
  chan_id: string;
  capacity: string;
  local_balance: string;
  remote_balance: string;
  commit_fee: string;
  commit_weight: string;
  fee_per_kw: string;
  unsettled_balance: string;
  total_satoshis_sent: string;
  total_satoshis_received: string;
  num_updates: string;
  pending_htlcs: any; // TODO: lnrpcHTLC
  private: boolean;
  initiator: boolean;
  chan_status_flags: string;
  commitment_type: any; // TOD0
  lifetime: string;
  uptime: string;
  close_address: string;
  push_amount_sat: string;
  thaw_height: number;
  local_constraints: any; // TODO
  remote_constraints: any; // TODO
}
export enum LndPaymentStatus {
  UNKNOWN = "UNKNOWN",
  IN_FLIGHT = "IN_FLIGHT",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED"
}

export interface LndListPaysResult {
  payment_hash: string;
  value: string;
  creation_date: string;
  fee: string;
  payment_preimage: string;
  value_sat: string;
  value_msat: string;
  payment_request: string;
  status: LndPaymentStatus;
  fee_sat: string;
  fee_msat: string;
  creation_time_ns: string;
  htlcs: any;
  payment_index: string;
  failure_reason: any;
}
export enum LndAddressType {
  WITNESS_PUBKEY_HASH,
  NESTED_PUBKEY_HASH,
  UNUSED_WITNESS_PUBKEY_HASH,
  UNUSED_NESTED_PUBKEY_HASH
}
export interface LndOutPoint {
  txid_bytes: string; // Raw bytes representing the transaction id.
  txid_str: string; // 	Reversed, hex-encoded string representing the transaction id.
  output_index: number; // 	The index of the output on the transaction.
}
export interface LndUtxo {
  address_type: LndAddressType;
  address: string;
  amount_sat: string;
  pk_script: string;
  outpoint: LndOutPoint;
  confirmations: string;
}
export interface LndPayInvoiceResult {
  payment_hash: string;
  value: string;
  creation_date: string;
  fee: string;
  payment_preimage: string;
  value_sat: string;
  value_msat: string;
  payment_request: string;
  status: "SUCCEEDED";
  fee_sat: string;
  fee_msat: string;
  creation_time_ns: string;
  htlcs: any[]; // TODO [Array],
  payment_index: string;
  failure_reason: string;
}
