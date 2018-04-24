import { ec as EC } from 'elliptic'
import { Buffer } from "buffer"
import { BN } from "bn.js"

const ec = new EC('secp256k1')
const uncompressedPrefix = 4
const compressedOddYPrefix = 3
const compressedEvenYPrefix = 2

export function sign(messageHash: Buffer, privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    var derSignature = privateKeyPair.sign(messageHash).toDER()
    const sigBuffer = Buffer.from(derSignature)
    return sigBuffer
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    var importedPubKeyPair = ec.keyFromPublic(publicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function getCompressedPublicKey(privateKey: Buffer): Buffer {
    // console.log("hasdoubles:", ec.g._hasDoubles(new BN(privateKey)))
    const publicKeyPoint = ec.g.mul(new BN(privateKey))
    const compressedPublicKeyBuffer = Buffer.from(publicKeyPoint.encode("array", true))
    return compressedPublicKeyBuffer
}

export function getFullPublicKey(privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    const publicKey = privateKeyPair.getPublic().encode()
    return Buffer.from(publicKey)
}

export function getFullPublicKeyFromCompressed(compressedPublicKey: Buffer): Buffer {
    return Buffer.from(ec.keyFromPublic(compressedPublicKey).getPublic().encode())
}