import * as assert from "assert"
import * as bitcoin from "./bitcoin"

describe('bitcoin', () => {
    describe('generateMnemonic', () => {
        it('generate a valid mnemonic', () => {
            const randomBuffer = Buffer.from("0c1e24e5917779d297e14d45f14e1a1a", "hex")
            const expectedMnemonic = "army van defense carry jealous true garbage claim echo media make crunch".split(" ")
            const actualMnemonic = bitcoin.generateMnemonic(randomBuffer)
            assert.ok(actualMnemonic.every((v, i) => v === expectedMnemonic[i]))
        })
    })
    describe('getSeedFromMnemonic', () => {
        it('generate a valid seed', () => {
            const mnemonic = "army van defense carry jealous true garbage claim echo media make crunch".split(" ")
            const expectedSeed = "5b56c417303faa3fcba7e57400e120a0ca83ec5a4fc9ffba757fbe63fbd77a89a1a3be4c67196f57c39a88b76373733891bfaba16ed27a813ceed498804c0570"
            const actualSeed = bitcoin.getSeedFromMnemonic(mnemonic).toString("hex")
            assert.equal(actualSeed, expectedSeed)
        })
    })
})