const crypto = require('crypto');
import { Block } from "./block"

const version = 0x01
const difficulty = 0x02

blockOneData.value = "firstBlock"
blockOneNonceValue.innerText = "39887"
blockOneHashValue.innerText = "00000b17aa201c938d244c2b8611af9a8bb23b9db5fa86aaa94a06260aee21cf"
blockTwoData.value = "secondBlock"
blockTwoNonceValue.innerText = "80580"
blockTwoHashValue.innerText = "00003ead43d4030ccfb9578aa8bbcd8f5937a99ff59d597842fd268f162cc939"

var blockChain = {}
var genesisBlock = Block.createGenesis()
var res = genesisBlock.mine();
genesisBlock.nonce = res.nonce
genesisBlock.hash = res.blockHash
blockChain[genesisBlock.hash] = genesisBlock
var firstBlock = Block.create(blockOneData.value, difficulty, genesisBlock.hash)
firstBlock.nonce = parseInt(blockOneNonceValue.innerText)
firstBlock.hash = Buffer.from(blockOneHashValue.innerText, "hex")
blockChain[firstBlock.hash] = firstBlock
var secondBlock = Block.create(blockTwoData.value, difficulty, firstBlock.hash)
secondBlock.nonce = parseInt(blockTwoNonceValue.innerText)
secondBlock.hash = Buffer.from(blockTwoHashValue.innerText, "hex")
blockChain[secondBlock.hash] = secondBlock

console.log(blockChain)

blockOneData.oninput = (event) => {
    updateFirstBlock()
    updateSecondBlock()
}

blockOneVerifyButton.onclick = () => {
    updateFirstBlock()
}

blockOneMineButton.onclick = () => {
    firstBlock = Block.create(blockOneData.value, difficulty, genesisBlock.hash)
    const mineResult = firstBlock.mine()
    firstBlock.nonce = mineResult.nonce
    firstBlock.hash = mineResult.blockHash
    blockOneNonceValue.innerText = mineResult.nonce
    blockOneHashValue.innerText = mineResult.blockHash.toString("hex")
    console.log(firstBlock)

    updateFirstBlock()
    updateSecondBlock()
}

blockTwoData.oninput = (event) => {
    updateSecondBlock()
}

blockTwoVerifyButton.onclick = () => {
    updateSecondBlock()
}

blockTwoMineButton.onclick = () => {
    secondBlock = Block.create(blockTwoData.value, difficulty, firstBlock.hash)
    const mineResult = secondBlock.mine()
    secondBlock.nonce = mineResult.nonce
    secondBlock.hash = mineResult.blockHash
    blockTwoNonceValue.innerText = mineResult.nonce
    blockTwoHashValue.innerText = mineResult.blockHash.toString("hex")
    console.log(secondBlock)

    updateSecondBlock()
}

function updateFirstBlock() {
    firstBlock = Block.create(blockOneData.value, difficulty, genesisBlock.hash)
    firstBlock.nonce = parseInt(blockOneNonceValue.innerText)
    const actualHash = firstBlock.getHash(firstBlock.nonce)
    firstBlock.hash = actualHash
    blockOneHashValue.innerText = actualHash.toString("hex")

    if (!firstBlock.verify()) {
        console.error("block hash failed to verify")
        document.getElementById("firstBlock").classList.add("redBlock")
    } else {
        console.log("successfully verified block")
        document.getElementById("firstBlock").classList.remove("redBlock")
    }
}

function updateSecondBlock() {
    secondBlock = Block.create(blockTwoData.value, difficulty, firstBlock.hash)
    secondBlock.nonce = parseInt(blockTwoNonceValue.innerText)
    const actualHash = secondBlock.getHash(secondBlock.nonce)
    secondBlock.hash = actualHash
    blockTwoHashValue.innerText = actualHash.toString("hex")

    if (!secondBlock.verify()) {
        console.error("block hash failed to verify")
        document.getElementById("secondBlock").classList.add("redBlock")
    } else {
        console.log("successfully verified block")
        document.getElementById("secondBlock").classList.remove("redBlock")
    }
}