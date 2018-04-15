import * as base58 from "./base58"
import { Buffer } from "buffer"

export function getString(buffer: Buffer): string {
    const leadingZeroCharacter = "1"
    const codeArray = base58.getCharArray(buffer)
    for (let i = 0; buffer[i] == 0; i++) {
        codeArray.unshift(leadingZeroCharacter)
    }
    return codeArray.join("")
}

export function getBytes(base58String: string): Buffer {
    const prefixNumber = +base58String[0] - 1
    const subString = base58String.slice(1)
    const prefixbuffer = Buffer.from([prefixNumber])
    const dataBuffer = base58.getBytes(subString)
    const finalBuffer = Buffer.concat([prefixbuffer, dataBuffer])
    return finalBuffer
}