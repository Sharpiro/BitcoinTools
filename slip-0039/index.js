// const crypto = require('crypto');
// var temp = crypto.randomBytes(4)
// console.log(temp)

//simple SSS
var secret = 1234
var totalPartsN = 6
var recreationPartsK = 3

var randOne = 166
var randoTwo = 94

var temp1 = calculatePolynomial(0)
var temp2 = calculatePolynomial(1)
var temp3 = calculatePolynomial(2)
var temp4 = calculatePolynomial(3)
var temp5 = calculatePolynomial(4)
var temp6 = calculatePolynomial(5)
var temp7 = calculatePolynomial(6)

console.log(temp1);
console.log(temp2);
console.log(temp3);
console.log(temp4);
console.log(temp5);
console.log(temp6);
console.log(temp7);

function calculatePolynomial(x) {
    var polynomial = secret + (randOne * x) + (randoTwo * Math.pow(x, 2))
    return polynomial
}