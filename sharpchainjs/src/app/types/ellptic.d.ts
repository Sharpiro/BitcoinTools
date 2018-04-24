declare module "elliptic" {
    import { BN } from "bn.js"
    import { Buffer } from "buffer"

    class ec {
        constructor(curveType: string)
        curve: ShortCurve
        g: Point
        genKeyPair(): KeyPair
        keyFromPrivate(data: Buffer): KeyPair
        keyFromPublic(data: Buffer): KeyPair
    }

    interface KeyPair {
        getPublic(): Point
        getPrivate(): BN
        sign(messageHash: Buffer | any[]): Signature
        verify(messageHash: any, derSign: any): boolean
    }

    interface Signature {
        r: BN
        s: BN
        recoveryParam: number
        toDER(): number[]
    }

    interface ShortCurve {
        g: Point
        p: BN
        // pointFromX(xBuffer: Buffer, yIsOdd: boolean): Point
    }
    interface Point {
        x: BN
        y: BN
        type: string
        inf: boolean
        mul(k: BN): Point
        eq(other: Point): boolean
        encode(): number[]
        encode(encoding: "hex", compact?: boolean): string
        encode(encoding: "array", compact?: boolean): number[]
    }
}