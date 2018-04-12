import { Buffer } from 'buffer';
import * as cryptojs from "crypto-js"

export async function sha256Async(buffer: Buffer): Promise<Buffer> {
    var arrayBuffer = await window.crypto.subtle.digest("SHA-256", buffer)
    return new Buffer(arrayBuffer)
}

export function sha256(buffer: Buffer): Buffer {
    const libWordArray = cryptojs.lib.WordArray.create(buffer)
    const base64 = cryptojs.SHA256(libWordArray).toString(cryptojs.enc.Base64)
    return Buffer.from(base64, "base64")
}

export function ripemd160(buffer: Buffer): Buffer {
    const libWordArray = cryptojs.lib.WordArray.create(buffer)
    const base64 = cryptojs.RIPEMD160(libWordArray).toString(cryptojs.enc.Base64)
    return Buffer.from(base64, "base64")
}

export function getRandomBytes(length: number): Buffer {
    const wordArray = (<any>cryptojs.lib.WordArray).random(length);
    const base64 = wordArray.toString(cryptojs.enc.Base64)
    return Buffer.from(base64, "base64")
}