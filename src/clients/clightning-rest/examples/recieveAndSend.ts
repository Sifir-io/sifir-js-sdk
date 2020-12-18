import { client } from "../lncClient";
const lnc = client();
(async () => {
  try {
    const balances = await lnc.listFunds();
    const address = await lnc.getNewAddress();
    console.error(`Send BTC to ${address}`, balances);
    //const payed = await lnc.payBolt11(
    //  "lntb1p0a6ygcpp5vsnp8xquaf9mul28jv8x0qwy85a9s2f0grcu7vkhhg5agfz9sj4qdq8w3jhxaqxqyjw5qcqp2sp5l59jy535zmfkz2qh849j5nflnmnf29887cv2fuamgwncgvkk5uvqrzjqdj5sxjpefe5r9zpyx668q8kctpndr632am3fgp4wtvt9e4jysyfs88jy5qqq5sqqyqqqqlgqqqqqqgq9q9qy9qsqf7tzhlyv3yvzjjx5k4laxewsmqx3qw5h52v4krv89hqnk9m0qz5srpfpqxlr8tedmh5vfljnx8l8r6m62akerdtz4xzz4ndhsdyqzjqq2wwg42",
    //  1000
    //);
    //console.log("PAID", payed);
    const sent = await lnc.withdrawFunds(address, 20000);
    console.log(sent);
  } catch (err) {
    console.error(err.response.body);
  }
})();
