import * as base58 from "./base58"
import * as crypto from "./crypto_functions"

export function getBitcoinAddress(publicKey: Buffer): string {
    let sha = crypto.sha256(publicKey)
    const rip = crypto.ripemd160(sha)
    const extendedRip = Buffer.concat([Buffer.from([0]), rip])
    const checksum = crypto.sha256(crypto.sha256(extendedRip)).slice(0, 4)
    const extendedWithChecksum = Buffer.concat([extendedRip, checksum])
    const bitcoinAddress58Check = base58.getBase58Check(extendedWithChecksum)
    return bitcoinAddress58Check
}