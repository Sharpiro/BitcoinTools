import * as assert from "assert"
import * as base58Check from "./base58Check"

describe('base58Check', () => {
    describe('getBytes()', () => {
        it('should match the expected buffer', () => {
            const bitcoinAddress = "5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr"
            const expectedHex = "80eddbdc1168f1daeadbd3e44c1e3f8f5a284c2029f78ad26af98583a499de5b19"
            const actualHex = base58Check.getBytes(bitcoinAddress).toString("hex")
            assert.equal(actualHex, expectedHex)
        })

        it('should match the expected buffer', () => {
            const bitcoinAddress = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem"
            const expectedHex = "0047376c6f537d62177a2c41c4ca9b45829ab99083"
            const actualHex = base58Check.getBytes(bitcoinAddress).toString("hex")
            assert.equal(actualHex, expectedHex)
        })

        it('should match the expected buffer', () => {
            const bitcoinAddress = "xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6LBpB85b3D2yc8sfvZU521AAwdZafEz7mnzBBsz4wKY5e4cp9LB"
            const expectedHex = "0488b21e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            const actualHex = base58Check.getBytes(bitcoinAddress).toString("hex")
            assert.equal(actualHex, expectedHex)
        })

        it('should match the expected buffer', () => {
            const bitcoinAddress = "8AArJ45YvcruT9QZY6Vd8G8JSoSmF"
            const expectedData = "this is test Data"
            const actualData = base58Check.getBytes(bitcoinAddress).toString()
            assert.equal(actualData, expectedData)
        })
    })

    describe('getString()', () => {
        it('should match the expected base58 string', () => {
            const buffer = Buffer.from("80eddbdc1168f1daeadbd3e44c1e3f8f5a284c2029f78ad26af98583a499de5b19", "hex")
            const expectedBase58Check = "5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr"
            const actualBase58Check = base58Check.getString(buffer)
            assert.equal(actualBase58Check, expectedBase58Check)
        })

        it('should match the expected base58 string', () => {
            const buffer = Buffer.from("0047376c6f537d62177a2c41c4ca9b45829ab99083", "hex")
            const expectedBase58Check = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem"
            const actualBase58Check = base58Check.getString(buffer)
            assert.equal(actualBase58Check, expectedBase58Check)
        })

        it('should match the expected base58 string', () => {
            const buffer = Buffer.from("0488b21e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "hex")
            const expectedBase58Check = "xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6LBpB85b3D2yc8sfvZU521AAwdZafEz7mnzBBsz4wKY5e4cp9LB"
            const actualBase58Check = base58Check.getString(buffer)
            assert.equal(actualBase58Check, expectedBase58Check)
        })

        it('should match the expected base58 string', () => {
            const buffer = Buffer.from("this is test Data")
            const expectedBase58Check = "8AArJ45YvcruT9QZY6Vd8G8JSoSmF"
            const actualBase58Check = base58Check.getString(buffer)
            assert.equal(actualBase58Check, expectedBase58Check)
        })
    })
})