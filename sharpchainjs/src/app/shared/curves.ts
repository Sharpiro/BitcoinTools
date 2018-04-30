import { ec as EC } from 'elliptic'
import * as Signature from 'elliptic/lib/elliptic/ec/signature'
import { Buffer } from "buffer"
import { BN } from "bn.js"

const curve = new EC('secp256k1')
const uncompressedPrefix = 4
const compressedOddYPrefix = 3
const compressedEvenYPrefix = 2

export function sign(messageHash: Buffer, privateKey: Buffer, options: { k: (x) => BN } = undefined): Buffer {
    const privateKeyPair = curve.keyFromPrivate(privateKey)
    const tempK = "340a098bb9702ee3671cf9c7301ba1afb40f5180a1685ff13ade5738a08a0be5"
    var signature = privateKeyPair.sign(messageHash, undefined, options)
    // var sigR = signature.r.toArrayLike(Buffer)
    // var sigS = signature.s.toArrayLike(Buffer)

    // console.log(signature.r.toArrayLike(Buffer).toString("hex"));
    // console.log(sigR.toString("hex"));
    // console.log(sigS.toString("hex"));

    var derSignature = signature.toDER()

    const sigBuffer = Buffer.from(derSignature)
    // console.log(sigBuffer.toString("hex"));
    return sigBuffer
}

export function getSignature(derSignature: Buffer) {
    const signature = new Signature(derSignature.toString("hex"), "hex")
    return signature
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    var importedPubKeyPair = curve.keyFromPublic(publicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function getCompressedPublicKey(privateKey: Buffer): Buffer {
    const publicKeyPoint = curve.g.mul(new BN(privateKey))
    const compressedPublicKeyBuffer = Buffer.from(publicKeyPoint.encode("array", true))
    return compressedPublicKeyBuffer
}

export function getFullPublicKey(privateKey: Buffer): Buffer {
    const privateKeyPair = curve.keyFromPrivate(privateKey)
    const publicKey = privateKeyPair.getPublic().encode()
    return Buffer.from(publicKey)
}

export function getFullPublicKeyFromCompressed(compressedPublicKey: Buffer): Buffer {
    return Buffer.from(curve.keyFromPublic(compressedPublicKey).getPublic().encode())
}