const crypto = require("crypto")

// var buffer = crypto.randomBytes(4);
var secret = [6, 7, 8];
var randomBuffer1 = [7 , 8 , 9];
var randomBuffer2 = [4 , 5 , 6];
console.log(secret)
console.log(randomBuffer1)
console.log(randomBuffer2)
console.log()

// var temp = buffer.map(b => b ^ 125)

var temp = []
for (var i = 0; i < secret.length;i++){
    temp.push(secret[i] ^ randomBuffer1[i])
}

var temp2 = []
for (var i = 0; i < secret.length;i++){
    temp2.push(temp[i] ^ randomBuffer2[i])
}

var newBuffer = new Buffer(temp)
var newBuffer = new Buffer(temp2)
console.log(newBuffer)
console.log(newBuffer)
// console.log(temp)
// console.log(temp2)