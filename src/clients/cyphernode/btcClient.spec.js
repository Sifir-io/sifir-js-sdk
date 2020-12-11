"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const btcClient_1 = require("./btcClient");
const test = ava_1.serial;
test.before(async (t) => {
    const client = btcClient_1.client();
    // check which chain we're on
    const { chain } = await client.getBlockChainInfo();
    if (!chain)
        throw "Could not get blockChainInfo or undefined chain type";
    if (chain === "main")
        console.warn("**** WARNING: RUNNING TESTS ON MAINNET!!! *****");
    t.context = { ...client, chain };
});
/**
BTC tests
*/
test("Should be able to get a new legacy, p2sh or bech32 bitcoin address ", async (t) => {
    const { context: { getNewAddress, chain } } = t;
    const addressTypes = {
        legacy: ["1", "m"],
        "p2sh-segwit": ["3", "2"],
        bech32: ["b", "2"]
    };
    await Promise.all(Object.entries(addressTypes).map(async ([addressType, addressFirstChar]) => {
        const address = await getNewAddress(addressType);
        t.true(address.length >= 33);
        // TODO remove this and fix address prefix for testnet tests
        if (chain === "main")
            t.is(address[0].toString(), addressFirstChar[chain === "main" ? 0 : 1]);
    }));
});
test("Should be able to get the latest block's hash", async (t) => {
    const { context: { getBestBlockHash } } = t;
    const blockHash = await getBestBlockHash();
    t.is(blockHash.length, 64);
});
test("Should be able to get the a block's hash from its height", async (t) => {
    const { context: { getBlockHash, chain } } = t;
    const blockHash = await getBlockHash(593104);
    // testnet blocks can change, so only do actaul verification of blochash on mainnet
    if (chain === "main")
        t.is(blockHash, "00000000000000000005dc459f0575b17413dbe7685e3e0fd382ed521f1be68b");
    else
        t.true(!!blockHash.length);
});
test("Should be able to get the lastest block's info", async (t) => {
    const { context: { getBestBlockInfo } } = t;
    const blockInfo = await getBestBlockInfo();
    t.true(!!blockInfo.hash.length);
    t.true(!isNaN(blockInfo.height));
    t.true(!isNaN(blockInfo.time));
    t.true(!!blockInfo.tx.length);
});
test("Should be able to get the any block's info", async (t) => {
    const { context: { getBlockInfo, chain } } = t;
    if (chain === "test") {
        t.pass();
        return;
    }
    const blockHash = "0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf";
    const blockInfo = await getBlockInfo(blockHash);
    t.true(!!blockInfo.hash.length);
    t.true(!isNaN(blockInfo.height));
    t.true(!isNaN(blockInfo.time));
    t.true(!!blockInfo.tx.length);
});
test("Should be able to get a transactions info", async (t) => {
    const { context: { getTxn, chain } } = t;
    if (chain !== "main") {
        t.pass();
        return;
    }
    const txnId = "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
    const txnInfo = await getTxn(txnId);
    t.true(!!txnInfo.txid.length);
    t.true(txnInfo.confirmations > 1);
    t.true(txnInfo.time > 1);
    t.true(txnInfo.blocktime > 1);
});
test("Should be able to get the spending wallets balance", async (t) => {
    const { context: { getBalance } } = t;
    const balance = await getBalance();
    t.false(isNaN(balance));
});
test("Should be able to spend (will only run when testnet)", async (t) => {
    const { context: { getBalance, getNewAddress, spend, chain } } = t;
    if (chain !== "test") {
        t.pass();
        return;
    }
    const [balance, sendToAddress] = await Promise.all([
        getBalance(),
        getNewAddress()
    ]);
    if (balance <= 0)
        t.fail("Not enough funds to run spend test");
    const { status, hash } = await spend(sendToAddress, 0.0001);
    t.is(status, "accepted");
});
test("Should be able to get a spending wallets txns", async (t) => {
    const { context: { getTxnsSpending } } = t;
    const txns = await getTxnsSpending();
    t.true(Array.isArray(txns));
    t.true(txns.every(txn => !!txn.txid.length));
});
/* Watch Pub32 tests */
test("Should be able to get a list of watched Pub32 and their labels", async (t) => {
    const { context: { getWatchedPub32 } } = t;
    const watchedPub32 = await getWatchedPub32();
    t.true(Array.isArray(watchedPub32));
    if (watchedPub32.length < 1)
        t.pass();
    else {
        t.true(watchedPub32.every(({ pub32, label }) => pub32.length && label.length));
    }
});
test.skip("Should be able to watch a pub32", async (t) => {
    const { context: { watchPub32, chain } } = t;
    const tpub = chain === "main"
        ? "xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU"
        : "tpubDAenfwNu5GyCJWv8oqRAckdKMSUoZjgVF5p8WvQwHQeXjDhAHmGrPa4a4y2Fn7HF2nfCLefJanHV3ny1UY25MRVogizB2zRUdAo7Tr9XAjm";
    const pub32label = "js_sdkpub32_test";
    const watchOptions = {
        label: pub32label,
        nstart: 0,
        path: "0/n"
    };
    const { label, pub32, id } = await watchPub32(tpub, watchOptions);
    t.false(isNaN(id));
    t.is(pub32, tpub);
    t.is(label, watchOptions.label);
});
test("Should be able to get watched address for 32pub by labe", async (t) => {
    const { context: { getWatchedAddressesByPub32Label } } = t;
    const pub32Label = "js_sdkpub32_test";
    const watchedAddresses = await getWatchedAddressesByPub32Label(pub32Label);
    t.true(watchedAddresses.length > 0);
    t.true(watchedAddresses.every(({ address }) => address.length === 34));
});
test("Should be able to get a watched 32pub's balance by label", async (t) => {
    const { context: { getBalanceByPub32Label } } = t;
    const pub32Label = "js_sdkpub32_test";
    const balance = await getBalanceByPub32Label(pub32Label);
    t.true(!isNaN(balance));
});
test("Should be able to get a watched 32pub's unused addresses", async (t) => {
    const { context: { getUnusedAddressesByPub32Label } } = t;
    const pub32Label = "js_sdkpub32_test";
    const unusedAddressList = await getUnusedAddressesByPub32Label(pub32Label);
    t.true(Array.isArray(unusedAddressList));
    t.true(unusedAddressList.every(({ address, address_pub32_index }) => !!address.length && !isNaN(address_pub32_index)));
});
test("Should be able to get transactions for watch label ", async (t) => {
    const { context: { getTransactionsByPub32Label } } = t;
    const pub32Label = "js_sdkpub32_test";
    const pub32Txns = await getTransactionsByPub32Label(pub32Label);
    t.true(Array.isArray(pub32Txns));
    t.true(pub32Txns.every(({ amount, txid }) => !!txid.length && !isNaN(amount)));
});
test("Should be able to unwatch by label", async (t) => {
    const { context: { unwatchPub32ByLabel } } = t;
    const pub32Label = "js_sdkpub32_test";
    const { label } = await unwatchPub32ByLabel(pub32Label);
    t.is(label, pub32Label);
});
