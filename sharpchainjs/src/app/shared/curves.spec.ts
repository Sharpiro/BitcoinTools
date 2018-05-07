import * as assert from 'assert'
import * as base58Check from './base58Check'
import * as curves from './curves'
import * as crypto from '../shared/crypto_functions'

describe('curves', () => {
    describe('public key creation', () => {
        it('keys should match', () => {
            const privateKey = Buffer.from('420d0882bbeac75e9e03c1a3c868c037ac87e1c334741b0d31da6c59bf55a893', 'hex')
            const expectedFullPublicKey = curves.getFullPublicKey(privateKey)
            const compressedPublicKey = curves.getCompressedPublicKey(privateKey)
            const actualPublicKeyFromCompressed = curves.getFullPublicKeyFromCompressed(compressedPublicKey)
            assert.ok(Buffer.compare(expectedFullPublicKey, actualPublicKeyFromCompressed) === 0)
        })
        it('keys should match', () => {
            const privateKey = Buffer.from('18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725', 'hex')
            const expectedFullPublicKey = curves.getFullPublicKey(privateKey)
            const compressedPublicKey = curves.getCompressedPublicKey(privateKey)
            const actualPublicKeyFromCompressed = curves.getFullPublicKeyFromCompressed(compressedPublicKey)
            assert.ok(Buffer.compare(expectedFullPublicKey, actualPublicKeyFromCompressed) === 0)
        })
    })
    describe('signing', () => {
        it('signatures should be valid', () => {
            const privateKey = Buffer.from('420d0882bbeac75e9e03c1a3c868c037ac87e1c334741b0d31da6c59bf55a893', 'hex')
            const messageHash = Buffer.from('f52c44a5fa08dd6074492a1a3a1e4004e7013bed43c75031a7f138b3cacfad20', 'hex')
            const compressedPublicKey = curves.getCompressedPublicKey(privateKey)
            assert.equal(compressedPublicKey.toString('hex'), '03fa42b4756743ad6ca204b5fefc28474d7fc04503f7cb890d8ad4f44c9094549c')

            const signature = curves.sign(messageHash, privateKey)
            const verifyResult = curves.verify(messageHash, signature, compressedPublicKey)

            assert.ok(verifyResult)
            assert.equal(signature.toString('hex'), '3045022100cd1378a182e9f4d934e719d292741e6e11b15367831f427c83cd4f0b5a768da802207718bb70aa08eb54072c576d5f0131c0fda65e92d21fee3b2c86e07ae02279e3')
        })
    })

    describe('stress', () => {
        it('stress', () => {
            for (let i = 0; i < 1; i++) {
                const messageHash = crypto.getRandomBytes(32)
                const privateKey = crypto.getRandomBytes(32)
                const expectedFullPublicKey = curves.getFullPublicKey(privateKey)
                const compressedPublicKey = curves.getCompressedPublicKey(privateKey)
                const actualPublicKeyFromCompressed = curves.getFullPublicKeyFromCompressed(compressedPublicKey)
                if (Buffer.compare(expectedFullPublicKey, actualPublicKeyFromCompressed) !== 0) {
                    console.log('expected:', expectedFullPublicKey)
                    console.log('actual:', actualPublicKeyFromCompressed)
                    throw new Error('broke')
                }
                // console.log("combined_sig:", combinedSig.toString("hex"));

                const signature = curves.sign(messageHash, privateKey)
                const verifyResult = curves.verify(messageHash, signature, compressedPublicKey)
                console.log('isvalid:', verifyResult)
                if (!verifyResult) {
                    const length = signature.slice(20).length
                    console.log(length)
                    throw new Error('broke')
                }
            }
        })
    })
})