export enum BtcUnits {
  BTC = "BTC",
  SAT = "SAT",
  MSAT = "MSAT"
}
enum FxUnits {
  USD
}
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
const toUnit = (amount: number | string, from: BtcUnits, to: BtcUnits) => {
  let amountNum;
  switch (from) {
    case BtcUnits.BTC:
      amountNum = parseFloat(amount as string);
      break;
    default:
      amountNum = parseInt(amount as string);
      break;
  }
  const rate = ConversionMatrix[from].find(([unit]) => unit === to);
  return amountNum * rate[1];
};
export { toUnit };
