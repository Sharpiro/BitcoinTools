import { ec as EC, Signature as ISignature, KeyPair } from 'elliptic'
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
    var derSignature = signature.toDER()
    const sigBuffer = Buffer.from(derSignature)
    return sigBuffer
}

export function getSignature(derSignature: Buffer): ISignature {
    try {
        const signature = new Signature(derSignature.toString("hex"), "hex")
        return signature
    } catch (ex) {
        throw "invalid DER signature"
    }
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    try {
        const importedPubKeyPair = ec.keyFromPublic(publicKey);
        const result = importedPubKeyPair.verify(messageHash, signature)
        return result
    }
    catch (err) {
        return false
    }
}

export function hackSignatures(data1: Buffer, data2: Buffer, signature1: Buffer, signature2: Buffer) {
    if (data1.compare(data2) == 0) {
        throw "data1 and data2 cannot be equal"
    }
    const z1 = new BN(data1)
    const sig1 = getSignature(signature1)
    const r1 = sig1.r
    const s1 = sig1.s

    const z2 = new BN(data2)
    const sig2 = getSignature(signature2)
    const r2 = sig2.r
    const s2 = sig2.s

    if (!r1.eq(r2)) {
        throw "unhackable: r values are not equal, thus unique 'k' values were used"
    }

    const left = z1.sub(z2).umod(ec.curve.n)
    const right = s1.sub(s2).umod(ec.curve.n).invm(ec.curve.n)
    const k = left.mul(right).umod(ec.curve.n)

    const dALeft = s1.mul(k).umod(ec.curve.n).sub(z1).umod(ec.curve.n)
    const dARight = r1.invm(ec.curve.n)
    const dA = dALeft.mul(dARight).umod(ec.curve.n)

    const privateKeyPair = ec.keyFromPrivate(dA.toArrayLike(Buffer))
    const options = { k: (x) => k }
    var actualSignature1 = privateKeyPair.sign(z1.toArrayLike(Buffer), undefined, options)
    var actualSignature2 = privateKeyPair.sign(z2.toArrayLike(Buffer), undefined, options)

    if (Buffer.from(actualSignature1.toDER()).compare(signature1) !== 0
        || Buffer.from(actualSignature2.toDER()).compare(signature2) !== 0) {
        throw "failure: could not hack signature"
    }

    return { dA: dA.toArrayLike(Buffer), k: k.toArrayLike(Buffer) }
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