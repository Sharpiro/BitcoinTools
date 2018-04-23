declare module "bn.js" {
    import { Buffer } from "buffer"

    export class BN {
        constructor(number: string, base: number)
        constructor(buffer: Buffer)
        constructor(number?: number)
        length: number
        negative: number
        red: any
        words: number[]
        toString(encoding: string)
        toArrayLike(type: typeof Buffer): Buffer
        toNumber()
        add(other: BN): BN
        mul(other: BN): BN
        pow(other: BN): BN
        mod(other: BN): BN
        gt(other: BN): BN
        lt(other: BN): BN
        divmod(other: BN): { div: BN, mod: BN }
        sqr(): BN
        isOdd(): boolean
    }
}