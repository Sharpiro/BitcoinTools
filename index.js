var bitcore = require("bitcore-lib");
// var randBuffer = bitcore.crypto.Random.getRandomBuffer(32);
// var randNumber = bitcore.crypto.BN.fromBuffer(randBuffer);
// var randNumber = "BF86625F2FA2F88E6C4ADAB0DD3AB49799B69BAEE843FDD115E27BAD320464B2";
// var privateKey = new bitcore.PrivateKey(randNumber).toAddress();
// var fakePrivateKey = new bitcore.PrivateKey(randNumber).toAddress("testnet");
// var wifKey = bitcore.PrivateKey('testnet').toWIF();

var wifKey2 = bitcore.PrivateKey.fromWIF("cTQfxsFs7NUtg42ahfg9UL1QAGG7adoGacFhLpXWBehVc68dRQg8");
var address = wifKey2.toAddress();

// console.log(randNumber);
// console.log(privateKey);
// console.log(fakePrivateKey);
// console.log(wifKey);
console.log(wifKey2);
console.log(address);