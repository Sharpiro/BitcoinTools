import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export function sign(messageHash: Buffer, privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    var derSignature = privateKeyPair.sign(messageHash).toDER()
    return derSignature
}

export function verify(messageHash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    var importedPubKeyPair = ec.keyFromPublic(publicKey);
    const result = importedPubKeyPair.verify(messageHash, signature)
    return result
}

export function getPublicKey(privateKey: Buffer): Buffer {
    const privateKeyPair = ec.keyFromPrivate(privateKey)
    const publicKey = privateKeyPair.getPublic().encode()
    return Buffer.from(publicKey)
}