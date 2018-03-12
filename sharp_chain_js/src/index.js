const crypto = require('crypto');
const version = 0x01

// button.onclick = () => {
//     console.log("click me bro")
// }

blockOneData.value = "firstBlock"
blockOneVerifyButton.onclick = () => {
    console.log("click block one verify")
}
blockOneMineButton.onclick = () => {
    console.log("click block one mine")
}
blockTwoData.value = "secondBlock"
blockTwoVerifyButton.onclick = () => {
    console.log("click block two verify")
}
blockTwoMineButton.onclick = () => {
    console.log("click block two mine")
}
//create blocks
var genesisBlock = createGenesisBlock()
var res = mine(genesisBlock);
genesisBlock.nonce = res.nonce
genesisBlock.hash = res.hashResult
// console.log(genesisBlock)

// var data = Buffer.from("firstBlock", "utf8")
// const firstBlock = createBlock(data, 2, genesisBlock.hash)
// var res = mine(firstBlock);
// firstBlock.nonce = res.nonce
// firstBlock.hash = res.hashResult
// console.log(firstBlock)

// var data = Buffer.from("secondBlock", "utf8")
// const secondBlock = createBlock(data, 2, firstBlock.hash)
// var res = mine(secondBlock);
// secondBlock.nonce = res.nonce
// secondBlock.hash = res.hashResult
// console.log(secondBlock)

// //verify blocks
// var hasher = crypto.createHash('sha256')
// var hashableData = getHashableBlockData(genesisBlock, genesisBlock.nonce)
// var actualHashResult = hasher.update(hashableData).digest()
// if (genesisBlock.hash.compare(actualHashResult)) {
//     console.error("genesis block hash failed to verify")
//     console.log(genesisBlock.hash)
//     console.log(actualHashResult)
// }

// var hasher = crypto.createHash('sha256')
// var hashableData = getHashableBlockData(firstBlock, firstBlock.nonce)
// var actualHashResult = hasher.update(hashableData).digest()
// if (firstBlock.hash.compare(actualHashResult)) {
//     console.error("first block hash failed to verify")
//     console.log(firstBlock.hash)
//     console.log(actualHashResult)
// }

// var hasher = crypto.createHash('sha256')
// var hashableData = getHashableBlockData(secondBlock, secondBlock.nonce)
// var actualHashResult = hasher.update(hashableData).digest()
// if (secondBlock.hash.compare(actualHashResult)) {
//     console.error("second block hash failed to verify")
//     console.log(secondBlock.hash)
//     console.log(actualHashResult)
// }

// console.log("done")

function verifyBlock(block) {
    var hasher = crypto.createHash('sha256')
    var hashableData = getHashableBlockData(block, block.nonce)
    var actualHashResult = hasher.update(hashableData).digest()
    if (block.hash.compare(actualHashResult)) {
        console.error("second block hash failed to verify")
        console.log(block.hash)
        console.log(actualHashResult)
    }
}


function createGenesisBlock() {
    const block = {
        version: version,
        previousBlockHash: new Buffer(0),
        data: Buffer.from("genesis", "utf8"),
        timestamp: new Date().getDate(),
        difficulty: 1
    }
    return block
}

function createBlock(data, difficulty, previousHash) {
    const block = {
        version: version,
        previousBlockHash: previousHash,
        data: data,
        timestamp: new Date().getDate(),
        difficulty: difficulty,
    }
    return block
}

function getBytes32(number) {
    const buffer = new Buffer(4)
    buffer.writeInt32LE(number)
    return buffer
}

function getHashableBlockData(block, nonce) {
    const versionBuffer = getBytes32(block.version)
    const timestampBuffer = getBytes32(block.timestamp)
    const difficultyBuffer = getBytes32(block.difficulty)
    const nonceBuffer = getBytes32(nonce)
    const combinedBuffer = Buffer.concat(
        [
            versionBuffer,
            block.previousBlockHash,
            block.data,
            timestampBuffer,
            difficultyBuffer,
            nonceBuffer
        ]
    )
    return combinedBuffer
}

function mine(block) {
    for (let nonce = 0; nonce < 1000000; nonce++) {
        const hasher = crypto.createHash('sha256')
        const hashableData = getHashableBlockData(block, nonce)
        const hashResult = hasher.update(hashableData).digest()
        for (let j = 0; j < block.difficulty; j++) {
            if (hashResult[j] != 0) break
            if (j == block.difficulty - 1) {
                return { nonce, hashResult }
            }
        }
    }
    return -1
}