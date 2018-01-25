const crypto = require('crypto')

// const secretString = "0142f858"
const secretString = crypto.randomBytes(32).toString("hex")
console.log("secret", secretString)

const shards = CreateShards(secretString, 3)
console.log("shards", shards)

const resolvedSecret = ResolveSecret(shards)
console.log("resolvedSecret", resolvedSecret)

console.log("isValid", resolvedSecret == secretString)

function CreateShards(secretString, n) {
    let secretBuffer = Buffer.from(secretString, "hex")
    let shards = []
    let temp = secretBuffer
    for (let i = 0; i < n - 1; i++) {
        let randomShard = crypto.randomBytes(secretBuffer.length)
        shards.push(randomShard.toString('hex'))
        temp = XorBuffer(temp, randomShard)
    }
    shards.push(temp.toString('hex'))
    return shards
}

function ResolveSecret(shards) {
    let currentBuffer = Buffer.from(shards[0], "hex")
    for (let i = 0; i < shards.length - 1; i++) {
        currentBuffer = XorBuffer(currentBuffer, Buffer.from(shards[i + 1], "hex"))
    }
    return currentBuffer.toString('hex')
}

function XorBuffer(buffer1, buffer2) {
    if (buffer1.length != buffer2.length) throw "buffers must be equal to be XORed"
    var result = new Buffer(buffer1.length)
    for (let j = 0; j < result.length; j++) {
        result[j] = buffer1[j] ^ buffer2[j]
    }
    return result
}

// let r1 = 0x502d81c3
// console.log("r1", r1)
// const temp = secret ^ r1
// let r2 = crypto.randomBytes(secret.length)
// let r2 = 0xb03a123b
// console.log("r2", r2)

// const r3 = temp ^ r2
// console.log("r3", r3)

// const recombined = r3 ^ r2 ^ r1
// console.log("recombined", recombined)
// console.log("valid", recombined == secret)

//simple SSS
// var secret = 1234
// var totalPartsN = 6
// var recreationPartsK = 3

// var randOne = 166
// var randoTwo = 94

// var temp1 = calculatePolynomial(0)
// var temp2 = calculatePolynomial(1)
// var temp3 = calculatePolynomial(2)
// var temp4 = calculatePolynomial(3)
// var temp5 = calculatePolynomial(4)
// var temp6 = calculatePolynomial(5)
// var temp7 = calculatePolynomial(6)

// console.log(temp1)
// console.log(temp2)
// console.log(temp3)
// console.log(temp4)
// console.log(temp5)
// console.log(temp6)
// console.log(temp7)

// var globalData = [
//     { x: 2, y: 1942 },
//     { x: 4, y: 3402 },
//     { x: 5, y: 4414 },
//     // { x: 6, y: 1200 },
// ]

// var func = (x) => 1
// var func2 = (x) => 1

// var funcx = (x) => func(x) * func2(x)

// console.log(funcx(1))


// var lZero = getLBaseJFreeCoefficient(globalData, 0)
// var lOne = getLBaseJFreeCoefficient(globalData, 1)
// var lTwo = getLBaseJFreeCoefficient(globalData, 2)

// // console.log(lZero + lOne + lTwo)
// console.log(lZero)
// console.log(lOne)
// console.log(lTwo)

// function getLBaseJFreeCoefficient(data, j) {
//     let numerator = 1
//     let denomenator = 1
//     for (let m = 0; m < data.length; m++) {
//         if (m == j) continue
//         // val *= (x - data[m].x) / (data[j].x - data[m].x)

//         numerator *= data[m].x
//         denomenator *= (data[j].x - data[m].x)
//     }
//     const fraction = numerator / denomenator
//     return fraction
// }

// function calculatePolynomial(x) {
//     var polynomial = secret + (randOne * x) + (randoTwo * Math.pow(x, 2))
//     return polynomial
// }