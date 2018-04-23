import * as crypto from "./crypto_functions"
import { Buffer } from "buffer"
import { BN } from "bn.js"

const codeString = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export function getCharArray(buffer: Buffer): string[] {
    let bigX = new BN(buffer)
    let codeArray: string[] = []

    while (bigX.gt(new BN())) {
        var result = bigX.divmod(new BN(58))
        bigX = result.div
        codeArray.push(codeString[result.mod.toNumber()])
    }
    return codeArray.reverse()
}

export function getString(buffer: Buffer): string {
    const codeArray = this.getCharArray(buffer)
    const outputString = codeArray.join("")
    return outputString
}

export function getBytes(base58String: string): Buffer {
     let bigX = new BN()
    for (let i = 0; i < base58String.length; i++) {
        const remainder = codeString.indexOf(base58String[i])
        bigX = bigX.mul(new BN(58)).add(new BN(remainder))
    }

    const dataBuffer = bigX.toArrayLike(Buffer)
    return dataBuffer
}