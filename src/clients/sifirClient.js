"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = function (_a) {
    var transport = _a.transport;
    var get = transport.get, post = transport.post;
    var api = {
        getBtcWalletSnapshot: function (param) {
            return get("sifirGetBtcWalletSnapshot", param);
        },
        getLnWalletSnapshot: function (param) {
            return get("sifirGetLnWalletSnapshot", param);
        }
    };
    return api;
};
