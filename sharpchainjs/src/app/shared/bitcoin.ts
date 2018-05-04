import * as base58Check from './base58Check'
import * as crypto from './crypto_functions'
import { Buffer } from 'buffer'
import { wordList } from './bip39Words'

/** Retruns a bitcoin address from a compressed public key */
export function getBitcoinAddress(compressedPublicKey: Buffer, addressType: Buffer): string {
    const sha = crypto.sha256(compressedPublicKey)
    const rip = crypto.ripemd160(sha)
    const extendedRip = Buffer.concat([addressType, rip])
    const checksum = crypto.sha256(crypto.sha256(extendedRip)).slice(0, 4)
    const extendedWithChecksum = Buffer.concat([extendedRip, checksum])
    const bitcoinAddress58Check = base58Check.getString(extendedWithChecksum)
    return bitcoinAddress58Check
}

/** Generate new mnemonic words from a random buffer */
export function generateMnemonic(randomBuffer: Buffer): string[] {
    // if (randomBuffer.length > 32) throw new Error('random buffer must be less than or equal to 256 bits')
    const hashLength = randomBuffer.length * 8 / 32
    if (hashLength % 1 !== 0) throw new Error('random buffer in bits must be divisible by 32')

    const hash = crypto.sha256(randomBuffer)

    let data = ''
    for (let i = 0; i < randomBuffer.length; i++) {
        data += toBinaryString(randomBuffer[i])
    }
    data += toBinaryString(hash[0]).slice(0, hashLength)

    const mnemonic: string[] = []
    for (let i = 0; i < data.length; i += 11) {
        const slice = data.slice(i, i + 11)
        const index = parseInt(slice, 2)
        mnemonic.push(wordList[index])
    }
    return mnemonic
}

export function getSeedFromMnemonic(mnemonic: string[]): Buffer {
    const menomnicBuffer = Buffer.from(mnemonic.join(' '))
    const actualSeed = crypto.pbkdf2(menomnicBuffer, Buffer.from('mnemonic'))
    return actualSeed
}

export function getRootKeyFromSeed(rootSeed: Buffer): Buffer {
    const key = Buffer.from('Bitcoin seed', 'utf8')
    const rootKey = crypto.hmac512(rootSeed, key)
    const prefix = Buffer.from('0488ade4000000000000000000', 'hex')
    const masterKey = rootKey.slice(0, 32)
    const masterChain = rootKey.slice(-32)
    const combined = Buffer.concat([prefix, masterChain, Buffer.from([0]), masterKey])
    return combined
}

function toBinaryString(number: number, maxPadding = 8): string {
    const n = number.toString(2)
    return '0'.repeat(maxPadding).slice(n.length) + n
}