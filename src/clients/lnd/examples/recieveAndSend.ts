import { client } from "../lndClient";
const lnd = client();
(async () => {
  try {
    const balances = await lnd.listFunds();
    const address = await lnd.getNewAddress();
    console.warn(`Send BTC to ${address}`, balances);
    // Invoices <1000 SAT seem to fail with LND
    //const payed = await lnd.payBolt11(
    //  "lntb10n1p0axagvpp5d6wqe4v2aqfc9ml7xzp8j39jrxntkwxeatzmccm3kwf8xqm7lg4qdq8vdhk7mqxqypz9ccqp2sp5fsyc8rdqf8l46kvkjexdctdwnj804lzf6tspyysqdsnsy73x4jgsrzjqdj5sxjpefe5r9zpyx668q8kctpndr632am3fgp4wtvt9e4jysyfs88jy5qqq5sqqyqqqqlgqqqqqqgq9q9qy9qsqxqjcy237tfxt0ahefgevlvkrfkmd652ylmglyhzqna8twyfhxmcral0u5jksmxe4awwtdk6xula5mwsjsnyh50jk3sapw3g0gzetc0sqd78r8l"
    //);
    //console.log("PAID", payed);
    //const sent = await lnd.withdrawFunds(
    //  "2NGMDYzhy3Xaq6zejF9bTzuFPPdQSexnhVm",
    //  2000
    //);
    //console.log(sent);
  } catch (err) {
    console.error(Object.keys(err));
  }
})();
