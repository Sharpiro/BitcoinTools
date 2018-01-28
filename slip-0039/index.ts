import * as crypto from "crypto"

// const secretString = "0142f858"
const secretString = crypto.randomBytes(32).toString("hex")
console.log("secret", secretString)

const shards = CreateShards(secretString, 3)
console.log("shards", shards)

const resolvedSecret = ResolveSecret(shards)
console.log("resolvedSecret", resolvedSecret)

console.log("isValid", resolvedSecret == secretString)

function CreateShards(secretString: string, n: number) {
    let secretBuffer = Buffer.from(secretString, "hex")
    let shards: string[] = []
    let temp = secretBuffer
    for (let i = 0; i < n - 1; i++) {
        let randomShard = crypto.randomBytes(secretBuffer.length)
        shards.push(randomShard.toString('hex'))
        temp = XorBuffer(temp, randomShard)
    }
    shards.push(temp.toString('hex'))
    return shards
}

function ResolveSecret(shards: string[]) {
    let currentBuffer = Buffer.from(shards[0], "hex")
    for (let i = 0; i < shards.length - 1; i++) {
        currentBuffer = XorBuffer(currentBuffer, Buffer.from(shards[i + 1], "hex"))
    }
    return currentBuffer.toString('hex')
}

function XorBuffer(buffer1: Buffer, buffer2: Buffer) {
    if (buffer1.length != buffer2.length) throw "buffers must be equal to be XORed"
    var result = new Buffer(buffer1.length)
    for (let j = 0; j < result.length; j++) {
        result[j] = buffer1[j] ^ buffer2[j]
    }
    return result
}