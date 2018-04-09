import { Buffer } from 'buffer';
import * as cryptojs from "crypto-js"

export async function sha256Async(buffer: Buffer): Promise<Buffer> {
    var arrayBuffer = await window.crypto.subtle.digest("SHA-256", buffer)
    return new Buffer(arrayBuffer)
}

export function sha256(buffer: Buffer): Buffer {
    const base64 = cryptojs.SHA256("data").toString(cryptojs.enc.Base64)
    return Buffer.from(base64, "base64")
}