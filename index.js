var bitcore = require("bitcore-lib");

var privateKey = new bitcore.PrivateKey("testnet")
// var privateKey = bitcore.PrivateKey.fromWIF(wifKey)
var address = privateKey.toAddress()
var wifKey = privateKey.toWIF();

console.log(privateKey);
console.log(address);
console.log(wifKey);