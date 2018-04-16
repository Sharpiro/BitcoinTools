import * as base58 from "./base58"
import { Buffer } from "buffer"
import * as crypto from "./crypto_functions"

const checksumLength = 4
const prefixMap = {
    "1": "public key hash",
    "3": "script hash",
    "5": "private key (wif, uncompressed pubkey)",
    "K": "private key (wif, compressed pubkey)",
    "L": "private key (wif, compressed pubkey)",
    "xpub": "bip32 pubkey",
    "xprv": "bip32 private key",
    "m": "testnet pubkey hash",
    "n": "testnet pubkey hash",
    "2": "testnet script hash",
    "9": "testnet private key (wif, compressed pubkey)",
    "tpub": "testnet bip32 pubkey",
    "tprv": "testnet bip32 private key)",
}

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
    const subString = base58String.slice()
    const allDatabuffer = base58.getBytes(base58String)

    const preList: number[] = []
    for (let i = 0; base58String[i] == "1"; i++) {
        preList.push(0)
    }
    const preBuffer = Buffer.from(preList)
    let finalBuffer = Buffer.concat([preBuffer, allDatabuffer])
    if (!validateChecksum(finalBuffer)) throw "invalid buffer checksum"
    finalBuffer = finalBuffer.slice(0, -checksumLength)

    return finalBuffer
}

function validateChecksum(buffer: Buffer): boolean {
    const data = buffer.slice(0, -checksumLength)
    const expectedChecksum = buffer.slice(-checksumLength)
    const actualChecksum = crypto.sha256(crypto.sha256(data)).slice(0, checksumLength)
    var compareResult = Buffer.compare(expectedChecksum, actualChecksum)
    return compareResult == 0
}