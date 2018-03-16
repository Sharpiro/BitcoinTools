const crypto = require('crypto');

export class Block {
    constructor({
        version,
        previousBlockHash,
        data,
        timestamp,
        difficulty
    }) {
        this.version = version;
        this.previousBlockHash = previousBlockHash;
        this.data = data;
        // this.timestamp = timestamp;
        this.difficulty = difficulty;
    }

    verify() {
        var hasher = crypto.createHash('sha256')
        var blockHash = this.getHash(this.nonce)
        for (let j = 0; j < this.difficulty; j++) {
            if (blockHash[j] != 0) {
                return false
            }
            if (j == this.difficulty - 1) {
                return true
            }
        }
        return false
    }

    getHash(nonce) {
        const versionBuffer = Block.get32BitBuffer(this.version)
        // const timestampBuffer = getBytes32(block.timestamp)
        const hasher = crypto.createHash('sha256')
        const difficultyBuffer = Block.get32BitBuffer(this.difficulty)
        const nonceBuffer = Block.get32BitBuffer(nonce)
        const hashableData = Buffer.concat(
            [
                versionBuffer,
                this.previousBlockHash,
                this.data,
                // timestampBuffer,
                difficultyBuffer,
                nonceBuffer
            ]
        )
        const blockHash = hasher.update(hashableData).digest()
        return blockHash
    }

    mine() {
        for (let nonce = 0; nonce < 1000000; nonce++) {
            const blockHash = this.getHash(nonce)
            for (let j = 0; j < this.difficulty; j++) {
                if (blockHash[j] != 0) break
                if (j == this.difficulty - 1) {
                    return { nonce, blockHash }
                }
            }
        }
        return -1
    }

    static createGenesis() {
        const block = new Block({
            version: this.version,
            previousBlockHash: new Buffer(0),
            data: Buffer.from("genesis", "utf8"),
            // timestamp: new Date().getDate(),
            difficulty: 1
        })
        return block
    }

    static create(version, data, difficulty, previousHash) {
        const versionBuffer = Block.get32BitBuffer(version)
        const dataBuffer = Buffer.from(data, "utf8")
        const block = new Block({
            version: version,
            previousBlockHash: previousHash,
            data: dataBuffer,
            // timestamp: new Date().getDate(),
            difficulty: difficulty,
        })
        return block
    }

    static get32BitBuffer(number) {
        const buffer = new Buffer(4)
        buffer.writeInt32LE(number)
        return buffer
    }
}