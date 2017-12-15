var keyFunctions = require("./src/keyFunctions")


var path = "D:\\realKey.txt"
// var path = process.env.localappdata + "\\temp\\data.txt"
var privateKey = keyFunctions.getPrivateKeyFromWifFile(path)
var address = privateKey.toAddress();
var wif = privateKey.toWIF()

// var recipientAddress = "mrxEUVah22256M7mx6uUWA1PDkUxVFgJ42"
// keyFunctions.getBalance(address)
//     .then(data => console.log(data))

// keyFunctions.getBalance(recipientAddress)
// .then(data => console.log(data))

// keyFunctions.sendFunds(10000, privateKey, recipientAddress)

console.log(privateKey);
console.log(address);
console.log(wif);


