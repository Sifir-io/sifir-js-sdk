"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LndAddressType = exports.LndPaymentStatus = exports.LndPeerSyncType = exports.LndInvoiceState = void 0;
var LndInvoiceState;
(function (LndInvoiceState) {
    LndInvoiceState[LndInvoiceState["OPEN"] = 0] = "OPEN";
    LndInvoiceState[LndInvoiceState["SETTLED"] = 1] = "SETTLED";
    LndInvoiceState[LndInvoiceState["CANCELED"] = 2] = "CANCELED";
    LndInvoiceState[LndInvoiceState["ACCEPTED"] = 3] = "ACCEPTED";
})(LndInvoiceState = exports.LndInvoiceState || (exports.LndInvoiceState = {}));
var LndPeerSyncType;
(function (LndPeerSyncType) {
    LndPeerSyncType[LndPeerSyncType["UNKNOWN_SYNC"] = 0] = "UNKNOWN_SYNC";
    LndPeerSyncType[LndPeerSyncType["ACTIVE_SYNC"] = 1] = "ACTIVE_SYNC";
    LndPeerSyncType[LndPeerSyncType["PASSIVE_SYNC"] = 2] = "PASSIVE_SYNC";
})(LndPeerSyncType = exports.LndPeerSyncType || (exports.LndPeerSyncType = {}));
var LndPaymentStatus;
(function (LndPaymentStatus) {
    LndPaymentStatus["UNKNOWN"] = "UNKNOWN";
    LndPaymentStatus["IN_FLIGHT"] = "IN_FLIGHT";
    LndPaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    LndPaymentStatus["FAILED"] = "FAILED";
})(LndPaymentStatus = exports.LndPaymentStatus || (exports.LndPaymentStatus = {}));
var LndAddressType;
(function (LndAddressType) {
    LndAddressType[LndAddressType["WITNESS_PUBKEY_HASH"] = 0] = "WITNESS_PUBKEY_HASH";
    LndAddressType[LndAddressType["NESTED_PUBKEY_HASH"] = 1] = "NESTED_PUBKEY_HASH";
    LndAddressType[LndAddressType["UNUSED_WITNESS_PUBKEY_HASH"] = 2] = "UNUSED_WITNESS_PUBKEY_HASH";
    LndAddressType[LndAddressType["UNUSED_NESTED_PUBKEY_HASH"] = 3] = "UNUSED_NESTED_PUBKEY_HASH";
})(LndAddressType = exports.LndAddressType || (exports.LndAddressType = {}));
