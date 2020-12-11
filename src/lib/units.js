"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUnit = exports.BtcUnits = void 0;
var BtcUnits;
(function (BtcUnits) {
    BtcUnits["BTC"] = "BTC";
    BtcUnits["SAT"] = "SAT";
    BtcUnits["MSAT"] = "MSAT";
})(BtcUnits = exports.BtcUnits || (exports.BtcUnits = {}));
var FxUnits;
(function (FxUnits) {
    FxUnits[FxUnits["USD"] = 0] = "USD";
})(FxUnits || (FxUnits = {}));
const FiatFx = { [FxUnits.USD]: 25000 };
const ConversionMatrix = {
    [BtcUnits.BTC]: [
        [BtcUnits.MSAT, 1e11],
        [BtcUnits.SAT, 1e8],
        [BtcUnits.BTC, 1]
    ],
    [BtcUnits.SAT]: [
        [BtcUnits.MSAT, 1e3],
        [BtcUnits.SAT, 1],
        [BtcUnits.BTC, 1e-8]
    ],
    [BtcUnits.MSAT]: [
        [BtcUnits.MSAT, 1],
        [BtcUnits.SAT, 1e-3],
        [BtcUnits.BTC, 1e-11]
    ]
};
const toUnit = (amount, from, to) => {
    let amountNum;
    switch (from) {
        case BtcUnits.BTC:
            amountNum = parseFloat(amount);
            break;
        default:
            amountNum = parseInt(amount);
            break;
    }
    const rate = ConversionMatrix[from].find(([unit]) => unit === to);
    return amountNum * rate[1];
};
exports.toUnit = toUnit;
