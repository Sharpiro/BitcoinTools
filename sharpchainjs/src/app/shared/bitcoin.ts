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
    const hashBitLength = randomBuffer.length * 8 / 32
    if (hashBitLength % 1 !== 0) throw new Error('random buffer in bits must be divisible by 32')

    const hashByteLength = Math.ceil(hashBitLength / 8)
    const padding = 4 - hashByteLength
    const hash = crypto.sha256(randomBuffer)
    const checksumBuffer = Buffer.concat([new Buffer(padding), hash.slice(0, hashByteLength)])
    const hashNumber = checksumBuffer.readInt32BE(0)

    // console.log(hashNumber)

    // console.log(randomBuffer)

    let data = ''
    for (let i = 0; i < randomBuffer.length; i++) {
        data += toBinaryString(randomBuffer[i])
    }
    const checksum = toBinaryString(hashNumber, hashBitLength).slice(0, hashBitLength)
    // console.log(checksum)

    data += toBinaryString(hashNumber, hashBitLength).slice(0, hashBitLength)

    // console.log(data)

    const mnemonic: string[] = []
    for (let i = 0; i < data.length; i += 11) {
        const slice = data.slice(i, i + 11)
        const index = parseInt(slice, 2)
        mnemonic.push(wordList[index])
    }
    return mnemonic
}

export function getEntropyFromMnemonic(mnemonic: string[]): Buffer {
    const indexes = []
    const words = []
    let allBinary = ''
    for (let i = 0; i < mnemonic.length; i++) {
        for (let j = 0; j < wordList.length; j++) {
            if (wordList[j] === mnemonic[i]) {
                indexes.push(j)
                words.push(toBinaryString(j, 11))
                allBinary += toBinaryString(j, 11)
            }
        }
    }

    const bytes: number[] = []
    const checksumLengthBits = mnemonic.length * 11 % 32
    const checksumLengthBytes = Math.ceil(checksumLengthBits / 8)
    // console.log(allBinary)
    // console.log(checksumLength)

    for (let i = 8; i <= allBinary.length - checksumLengthBits; i++) {
        if (i % 8 !== 0) continue
        const bits = allBinary.slice(i - 8, i)
        const number = FromBinaryString(bits)
        bytes.push(number)
    }

    const buffer = Buffer.from(bytes)

    // console.log(buffer)

    const expectedCheckBinaryString = allBinary.slice(-checksumLengthBits)
    const expectedChecksumNumber = FromBinaryString(allBinary.slice(-checksumLengthBits))
    const tempExpectedBuffer = new Buffer(4)
    tempExpectedBuffer.writeInt32BE(expectedChecksumNumber, 0)

    const hash = crypto.sha256(buffer)

    // console.log(hash)

    const padding = 4 - checksumLengthBytes
    const actualChecksum = Buffer.concat([new Buffer(padding), hash.slice(0, checksumLengthBytes)])
    // const actualChecksumNumber = actualChecksum.readInt32BE(0) >> (checksumLengthBytes * 8 - checksumLengthBits)
    const actualChecksumBinaryString = toBinaryString(actualChecksum.readInt32BE(0), checksumLengthBits).slice(0, checksumLengthBits)

    // console.log(expectedChecksumNumber)
    // console.log(actualChecksumNumber)

    if (expectedCheckBinaryString !== actualChecksumBinaryString) throw new Error('Invalid mnemonic, checksum failed')

    return buffer
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

function FromBinaryString(binary: string): number {
    // const buffer = Buffer.from(binary, 'binary')
    // const number = buffer.readUInt8(0)
    const number = parseInt(binary, 2)
    return number
}