// const crypto = require('crypto');
// var temp = crypto.randomBytes(4)
// console.log(temp)

//simple SSS
var secret = 1234
var totalPartsN = 6
var recreationPartsK = 3

var randOne = 166
var randoTwo = 94

// var temp1 = calculatePolynomial(0)
// var temp2 = calculatePolynomial(1)
// var temp3 = calculatePolynomial(2)
// var temp4 = calculatePolynomial(3)
// var temp5 = calculatePolynomial(4)
// var temp6 = calculatePolynomial(5)
// var temp7 = calculatePolynomial(6)

// console.log(temp1);
// console.log(temp2);
// console.log(temp3);
// console.log(temp4);
// console.log(temp5);
// console.log(temp6);
// console.log(temp7);

var globalData = [
    { x: 2, y: 1942 },
    { x: 4, y: 3402 },
    { x: 5, y: 4414 },
    // { x: 6, y: 1200 },
]

// var func = (x) => 1
// var func2 = (x) => 1

// var funcx = (x) => func(x) * func2(x)

// console.log(funcx(1))


var lZero = getLBaseJFreeCoefficient(globalData, 0)
var lOne = getLBaseJFreeCoefficient(globalData, 1)
var lTwo = getLBaseJFreeCoefficient(globalData, 2)

// console.log(lZero + lOne + lTwo);
console.log(lZero);
console.log(lOne);
console.log(lTwo);

function getLBaseJFreeCoefficient(data, j) {
    let numerator = 1
    let denomenator = 1
    for (let m = 0; m < data.length; m++) {
        if (m == j) continue
        // val *= (x - data[m].x) / (data[j].x - data[m].x)

        numerator *= data[m].x
        denomenator *= (data[j].x - data[m].x)
    }
    const fraction = numerator / denomenator
    return fraction
}

// function calculatePolynomial(x) {
//     var polynomial = secret + (randOne * x) + (randoTwo * Math.pow(x, 2))
//     return polynomial
// }