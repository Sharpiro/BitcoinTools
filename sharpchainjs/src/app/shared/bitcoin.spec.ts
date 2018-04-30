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
        it('generate a valid mnemonic', () => {
            const randomBuffer = Buffer.from("3850404b9a686cb2d61c21c3a5d1b820bbbb97c89369ae97c6df3c1fc453e544", "hex")
            const expectedMnemonic = "debate link base crumble man floor flash loud senior company host door roof slogan car honey purse sail result join wisdom clarify never orient".split(" ")
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
        it('generate a valid seed', () => {
            const mnemonic = "debate link base crumble man floor flash loud senior company host door roof slogan car honey purse sail result join wisdom clarify never orient".split(" ")
            const expectedSeed = "354d28d9bf4b20874154ca5a0d7db9082eb361d1cc5e12171689c60568c200946e97456b2033e5a69732c24ec16e33556844f6cadd2c1e5001ec7b866b4cece3"
            const actualSeed = bitcoin.getSeedFromMnemonic(mnemonic).toString("hex")
            assert.equal(actualSeed, expectedSeed)
        })
    })

    describe('get root key from seed', () => {
        it('generates root key', () => {
            const seed = "354d28d9bf4b20874154ca5a0d7db9082eb361d1cc5e12171689c60568c200946e97456b2033e5a69732c24ec16e33556844f6cadd2c1e5001ec7b866b4cece3"
            const expectedRootKey = "0488ade4000000000000000000bb0b365d8756497aea1bed975a2da210b3b0a731e77db41e09f503b7bd17c0d600957b0bbc3a38029bdc1c0339a70cb1c183be114185f417a8efca02678a4f8df2"
            const actualRootKey = bitcoin.getRootKeyFromSeed(Buffer.from(seed, "hex")).toString("hex")
            assert.equal(actualRootKey, expectedRootKey)
        })
        it('generates root key', () => {
            const seed = "dd8e29989d9a85a852d405998b0f0574e7a23b9c15c3a699d8afe4a691db55fd9c73ab075575242e05290a765ed2193ba78925e00224ecade8e66d94ab6eecd7"
            const expectedRootKey = "0488ade4000000000000000000d3dcf5bf1f194134f58931cd8022d1bbb022de720f741b0de29e411b8cfed4b4003050c6434cc31ef72c3c350b7861575147e014f961eaea9c7cfd3098eb2b4136"
            const actualRootKey = bitcoin.getRootKeyFromSeed(Buffer.from(seed, "hex")).toString("hex")
            assert.equal(actualRootKey, expectedRootKey)
        })
        it('generates root key', () => {
            const seed = "6b7019bb1900ea6e5f7a98cbce44ab2addc58a6f8727fa1d77ed7aad2b2d07863d656a6c7584c7bfae159b8b6b9b781f469c6120cb1fedf1fa788d8a199d6134"
            const expectedRootKey = "0488ade40000000000000000008e6469a44db468dc09c4fecd83e30b80fc905aea22f8cfb91555ac840a207980006c065944b1537765c99816ad4a4b37298ac41e4a7e6f5fc43ff02971a0634124"
            const actualRootKey = bitcoin.getRootKeyFromSeed(Buffer.from(seed, "hex")).toString("hex")
            assert.equal(actualRootKey, expectedRootKey)
        })
    })
})