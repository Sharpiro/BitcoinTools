declare module "bn.js" {
    import { Buffer } from "buffer"

    export class BN {
        constructor(buffer: Buffer)
        constructor(number: number)
        length: number
        negative: number
        red: any
        words: number[]
        toString(encoding: string)
        toArrayLike(type: typeof Buffer): Buffer
        add(other: BN): BN
        mul(other: BN): BN
        pow(other: BN): BN
        mod(other: BN): BN
        sqr(): BN
        isOdd(): boolean
    }
}