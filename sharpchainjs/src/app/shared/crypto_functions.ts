import { Buffer } from 'buffer'
import * as cryptojs from 'crypto-js'
import * as pbkdf2Lib from 'pbkdf2'

export async function sha256Async(buffer: Buffer): Promise<Buffer> {
    const arrayBuffer = await window.crypto.subtle.digest('SHA-256', buffer)
    return new Buffer(arrayBuffer)
}

export function sha256(buffer: Buffer): Buffer {
    const libWordArray = cryptojs.lib.WordArray.create(buffer)
    const base64 = cryptojs.SHA256(libWordArray).toString(cryptojs.enc.Base64)
    return Buffer.from(base64, 'base64')
}

export function sha128(buffer: Buffer): Buffer {
    const libWordArray = cryptojs.lib.WordArray.create(buffer)
    const base64 = cryptojs.SHA1(libWordArray).toString(cryptojs.enc.Base64)
    return Buffer.from(base64, 'base64')
}

export function ripemd160(buffer: Buffer): Buffer {
    const libWordArray = cryptojs.lib.WordArray.create(buffer)
    const base64 = cryptojs.RIPEMD160(libWordArray).toString(cryptojs.enc.Base64)
    return Buffer.from(base64, 'base64')
}

export function getRandomBytes(length: number): Buffer {
    const wordArray = (<any>cryptojs.lib.WordArray).random(length)
    const base64 = wordArray.toString(cryptojs.enc.Base64)
    return Buffer.from(base64, 'base64')
}

export function pbkdf2(password: Buffer, salt?: Buffer, iterations = 2048, outputSizeBytes = 64, hashAlg: 'sha256' | 'sha512' = 'sha512'): Buffer {
    return pbkdf2Lib.pbkdf2Sync(password, salt, iterations, outputSizeBytes, hashAlg)
}

export function hmac512(message: Buffer, key: Buffer): Buffer {
    const dataArray = cryptojs.lib.WordArray.create(message)
    const keyArray = cryptojs.lib.WordArray.create(key)
    const hmac = cryptojs.HmacSHA512(dataArray, keyArray)
    const base64 = hmac.toString(cryptojs.enc.Base64)
    return Buffer.from(base64, 'base64')
}