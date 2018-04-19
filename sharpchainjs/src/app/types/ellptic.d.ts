declare module "elliptic" {
    import { BN } from "bn.js"
    import { Buffer } from "buffer"

    class ec {
        curve: ShortCurve
        constructor(curveType: string)
        genKeyPair(): KeyPair
        keyFromPrivate(data: Buffer): KeyPair
        keyFromPublic(data: Buffer): KeyPair
    }

    interface KeyPair {
        getPublic(): Point
        getPrivate(): BN
        sign(messageHash: Buffer | any[]): any
        verify(messageHash: any, derSign: any): boolean
    }

    interface ShortCurve {
        g: Point
        p: BN
        pointFromX(x: any, y: any): Point
    }
    interface Point {
        x: BN
        y: BN
        type: string
        inf: boolean
        mul(k: BN): Point
        eq(other: Point): boolean
        encode(): number[]
        encode(encoding: string): string
    }
}