declare module "bn.js" {
    import { Buffer } from "buffer"

    export class BN {
        constructor(number: string, base: number)
        constructor(buffer: Buffer)
        constructor(number?: number)
        constructor(number: string, encoding: string)
        length: number
        negative: number
        red: any
        words: number[]
        toString(encoding: string)
        toArrayLike(type: typeof Buffer): Buffer
        toNumber()
        add(other: BN): BN
        sub(other: BN): BN
        mul(other: BN): BN
        pow(other: BN): BN
        mod(other: BN): BN
        umod(other: BN): BN
        invm(other: BN): BN
        eq(other: BN): boolean
        gt(other: BN): BN
        lt(other: BN): BN
        divmod(other: BN): { div: BN, mod: BN }
        sqr(): BN
        isOdd(): boolean
    }
}