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

export function signCombined(messageHash: Buffer, privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    var derSignature = privateKeyPair.sign(messageHash).toDER()
    const sigBuffer = Buffer.from(derSignature)
    const combinedBuffer = Buffer.concat([messageHash, sigBuffer])
    return combinedBuffer
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    var importedPubKeyPair = ec.keyFromPublic(publicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function verifyCombined(combinedHashSig: Buffer, publicKey: Buffer, hashSize = 20): boolean {
    // if (publicKey.length != 33 && publicKey.length != 65) {
    //     const data = 2
    //     // throw "invalid public key"
    // }
    // if (publicKey.length < 65) {
    //     const data = 2
    //     // throw "invalid public key"
    // }
    const fullPublicKey = getFullPublicKeyFromCompressed(publicKey)
    const messageHash = combinedHashSig.slice(0, hashSize)
    const signature = combinedHashSig.slice(hashSize)
    var importedPubKeyPair = ec.keyFromPublic(fullPublicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function getFullPublicKey(privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    const publicKey = privateKeyPair.getPublic().encode()
    return Buffer.from(publicKey)
}

export function getFullPublicKeyFromCompressed(compressedPublicKey: Buffer): Buffer {
    const isOdd = compressedPublicKey[0] == compressedOddYPrefix
    return Buffer.from(ec.curve.pointFromX(compressedPublicKey.slice(1), isOdd).encode())
}

export function getCompressedPublicKey(privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    const publicKeyPair = privateKeyPair.getPublic()

    const signBuffer = publicKeyPair.y.isOdd() ? Buffer.from([compressedOddYPrefix]) : Buffer.from([compressedEvenYPrefix])
    const publicKeyXBuffer = publicKeyPair.x.toArrayLike(Buffer)
    const compressedPublicKeyBuffer = Buffer.concat([signBuffer, publicKeyXBuffer])
    return compressedPublicKeyBuffer
}