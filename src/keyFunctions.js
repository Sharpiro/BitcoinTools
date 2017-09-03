var bitcore = require("bitcore-lib");
var Insight = require("bitcore-explorers").Insight;
var fs = require("fs");

function getPrivateKey(network) {
    return new bitcore.PrivateKey(network)
}

function getPrivateKeyFromWif(wifString) {
    return bitcore.PrivateKey.fromWIF(wifString)
}

function getPrivateKeyFromWifFile(wifFilePath) {
    var wif = fs.readFileSync(wifFilePath, { encoding: 'utf-8' });
    return getPrivateKeyFromWif(wif);
}

function getBalance(address) {
    var insight = new Insight("testnet")
    var promise = new Promise((res, rej) => {
        insight.getUnspentUtxos(address, function (err, utxos) {
            if (err) throw err
            else res(utxos)
        })
    });
    return promise
}

function sendFunds(amount, fromPrivateKey, toAddress) {
    var fromAddress = fromPrivateKey.toAddress();
    var insight = new Insight("testnet")
    insight.getUnspentUtxos(fromAddress, function (err, utxos) {
        if (err) console.log(err)
        else {
            var transaction = bitcore.Transaction();
            transaction.from(utxos)
            transaction.to(toAddress, amount)
            transaction.change(fromAddress)
            transaction.sign(fromPrivateKey)
            transaction.serialize() //prints out raw transaction data
            console.log(transaction.toObject())

            insight.broadcast(transaction, function (err, transactionId) {
                if (err) console.log(err)
                else {
                    console.log("successful broadcast: " + transactionId)
                }
            })
        }
    })
}

module.exports = {
    getPrivateKey: getPrivateKey,
    getPrivateKeyFromWif: getPrivateKeyFromWif,
    getPrivateKeyFromWifFile: getPrivateKeyFromWifFile,
    getBalance: getBalance,
    sendFunds: sendFunds,
};