declare module "elliptic" {
    import { BN } from "bn"

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
    }
    interface Point {
        x: any
        y: any
        type: string
        inf: boolean
        mul(k: any): Point
        eq(other: Point): boolean
        encode(): number[]
        encode(encoding: string): string
    }
}