import { ec as EC, Signature as ISignature } from 'elliptic'
import * as Signature from 'elliptic/lib/elliptic/ec/signature'
import { Buffer } from "buffer"
import { BN } from "bn.js"

const ec = new EC('secp256k1')
const uncompressedPrefix = 4
const compressedOddYPrefix = 3
const compressedEvenYPrefix = 2

export function sign(messageHash: Buffer, privateKey: Buffer, options: { k: (x) => BN } = undefined): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
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

export function getSignature(derSignature: Buffer): ISignature {
    const signature = new Signature(derSignature.toString("hex"), "hex")
    return signature
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    var importedPubKeyPair = ec.keyFromPublic(publicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function getCompressedPublicKey(privateKey: Buffer): Buffer {
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