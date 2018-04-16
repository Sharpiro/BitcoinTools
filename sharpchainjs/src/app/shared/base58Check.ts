import * as base58 from "./base58"
import { Buffer } from "buffer"
import * as crypto from "./crypto_functions"

const checksumLength = 4

export function getString(buffer: Buffer): string {
    const leadingZeroCharacter = "1"
    const checksumBuffer = crypto.sha256(crypto.sha256(buffer)).slice(0, checksumLength)
    const allDataBuffer = Buffer.concat([buffer, checksumBuffer])
    const codeArray = base58.getCharArray(allDataBuffer)
    for (let i = 0; allDataBuffer[i] == 0; i++) {
        codeArray.unshift(leadingZeroCharacter)
    }
    return codeArray.join("")
}

export function getBytes(base58String: string): Buffer {
    // const prefixNumber = +base58String[0] - 1
    const subString = base58String.slice()
    // const prefixbuffer = Buffer.from([prefixNumber])
    const allDatabuffer = base58.getBytes(base58String)
    if (!validateChecksum(allDatabuffer)) throw "invalid buffer checksum"

    const payloadBuffer = allDatabuffer.slice(0, allDatabuffer.length - 4)
    // const finalBuffer = Buffer.concat([prefixbuffer, dataBuffer])
    // return finalBuffer
    return payloadBuffer
}

function validateChecksum(buffer: Buffer): boolean {
    const data = buffer.slice(0, buffer.length - checksumLength)
    const expectedChecksum = buffer.slice(buffer.length - checksumLength)
    const actualChecksum = crypto.sha256(crypto.sha256(data)).slice(0, checksumLength)
    var compareResult = Buffer.compare(expectedChecksum, actualChecksum)
    return compareResult == 0
}