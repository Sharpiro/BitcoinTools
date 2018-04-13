import * as crypto from "./crypto_functions"
import * as bigInt from "big-integer"

const codeString = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export function getBase58Check(buffer: Buffer): string {
    const xHex = buffer.toString("hex")
    var bigX = bigInt(xHex, 16)
    let buildString = ""

    while (bigX.greater(0)) {
        var result = bigX.divmod(58)
        bigX = result.quotient
        buildString += codeString[result.remainder.toJSNumber()]
    }

    for (let i = 0; i < 1; i++) {
        buildString += codeString[0]
    }

    let outputString = ""
    for (let i = buildString.length - 1; i >= 0; i--) {
        outputString += buildString[i]
    }

    return outputString
}

export function getBytes(base58String: string): Buffer {
    const buffer = getRawBytes(base58String)
    if (!validateChecksum(buffer)) throw "checksum failed, invalid base58 string"
    return buffer
}

export function isValidBase58Check(base58String: string): boolean {
    const buffer = getRawBytes(base58String)
    const isValid = validateChecksum(buffer)
    return isValid
}

function getRawBytes(base58String: string): Buffer {
    var bigX = bigInt()
    for (let i = 1; i < base58String.length; i++) {
        const remainder = codeString.indexOf(base58String[i])
        bigX = bigX.multiply(58).add(remainder)
    }

    const preBuffer = new Buffer(1)
    const dataBuffer = Buffer.from(bigX.toArray(256).value)
    const finalBuffer = Buffer.concat([preBuffer, dataBuffer])
    return finalBuffer
}

function validateChecksum(buffer: Buffer): boolean {
    const checksumLength = 4
    const data = buffer.slice(0, buffer.length - checksumLength)
    const expectedChecksum = buffer.slice(buffer.length - checksumLength)
    const actualChecksum = crypto.sha256(crypto.sha256(data)).slice(0, 4)
    var compareResult = Buffer.compare(expectedChecksum, actualChecksum)
    return compareResult == 0
}