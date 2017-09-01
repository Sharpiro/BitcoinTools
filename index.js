var keyFunctions = require("./keyFunctions")

var path = process.env.localappdata + "\\temp\\data.txt"
var privateKey = keyFunctions.getPrivateKeyFromWifFile(path)
var address = privateKey.toAddress();


console.log(privateKey);
console.log(address);


