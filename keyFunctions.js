var bitcore = require("bitcore-lib");
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

module.exports = {
    getPrivateKey: getPrivateKey,
    getPrivateKeyFromWif: getPrivateKeyFromWif,
    getPrivateKeyFromWifFile: getPrivateKeyFromWifFile,
};