// import * as base58 from "./base58"
import * as base58Check from "./base58Check"
import * as crypto from "./crypto_functions"
import { Buffer } from "buffer"


export function getBitcoinAddress(publicKey: Buffer): string {
    let sha = crypto.sha256(publicKey)
    const rip = crypto.ripemd160(sha)
    const extendedRip = Buffer.concat([Buffer.from([0]), rip])
    const checksum = crypto.sha256(crypto.sha256(extendedRip)).slice(0, 4)
    const extendedWithChecksum = Buffer.concat([extendedRip, checksum])
    const bitcoinAddress58Check = base58Check.getString(extendedWithChecksum)
    return bitcoinAddress58Check
}