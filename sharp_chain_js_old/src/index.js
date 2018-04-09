const crypto = require('crypto');
const toastr = require('toastr');
import { Block } from "./block"
import css from '../styles/style.css';
import toastrCss from '../node_modules/toastr/build/toastr.min.css';
import materialJs from 'material-design-lite';
import materialCss from '../node_modules/material-design-lite/material.min.css';
import Worker from './workers/test.worker.js';
import MiningWorker from "./workers/miner.worker"

const version = 0x01
const difficulty = 0x02
var worker = new Worker()

blockOneData.value = "firstBlock"
blockOneNonceValue.innerText = "89748"
blockOneHashValue.innerText = "0000f5ba73f98d8aefc3f3ad1d590067e3dc1037417dfda869fa75fe87b733cd"
blockTwoData.value = "secondBlock"
blockTwoNonceValue.innerText = "3486"
blockTwoHashValue.innerText = "000043970c3bc406002f428950332c5a1ee8d2681328346d8be4a4d74da8faf1"

var blockChain = {}
var genesisBlock = Block.createGenesis()
var res = genesisBlock.mine();
genesisBlock.nonce = res.nonce
genesisBlock.hash = res.blockHash
blockChain[genesisBlock.hash] = genesisBlock
var firstBlock = Block.create(version, blockOneData.value, difficulty, genesisBlock.hash)
firstBlock.nonce = parseInt(blockOneNonceValue.innerText)
firstBlock.hash = Buffer.from(blockOneHashValue.innerText, "hex")
blockChain[firstBlock.hash] = firstBlock
var secondBlock = Block.create(version, blockTwoData.value, difficulty, firstBlock.hash)
secondBlock.nonce = parseInt(blockTwoNonceValue.innerText)
secondBlock.hash = Buffer.from(blockTwoHashValue.innerText, "hex")
blockChain[secondBlock.hash] = secondBlock

// console.log(blockChain)


blockOneData.oninput = () => {
    updateFirstBlock()
    verifyFirstBlock()
    updateSecondBlock()
    verifySecondBlock()
}

blockOneVerifyButton.onclick = () => {
    if (!verifyFirstBlock()) {
        toastr.error("first block hash failed to verify")
    } else {
        toastr.success("successfully verified first block")
    }
}

// onMiningCompleted = (event) => {
//     console.log(event)
// }

blockOneMineButton.onclick = () => {
    firstBlock = Block.create(version, blockOneData.value, difficulty, genesisBlock.hash)
    var minerWorker = new MiningWorker()
    minerWorker.postMessage(firstBlock);
    minerWorker.onmessage = (event) => {
        console.log(event)
        const mineResult = event.data
        const bufferedHash = new Buffer(mineResult.blockHash)
        firstBlock.nonce = mineResult.nonce
        firstBlock.hash = bufferedHash
        blockOneNonceValue.innerText = mineResult.nonce
        blockOneHashValue.innerText = bufferedHash.toString("hex")
        verifyFirstBlock()
        verifySecondBlock()
    }
}

blockTwoData.oninput = (event) => {
    updateSecondBlock()
    verifySecondBlock()
}

blockTwoVerifyButton.onclick = () => {
    if (!verifySecondBlock()) {
        toastr.error("second block hash failed to verify")
    } else {
        toastr.success("successfully verified second block")
    }
}

blockTwoMineButton.onclick = () => {
    secondBlock = Block.create(version, blockTwoData.value, difficulty, firstBlock.hash)

    var minerWorker = new MiningWorker()
    minerWorker.postMessage(secondBlock);
    minerWorker.onmessage = (event) => {
        console.log(event)
        const mineResult = event.data
        const bufferedHash = new Buffer(mineResult.blockHash)
        secondBlock.nonce = mineResult.nonce
        secondBlock.hash = bufferedHash
        blockTwoNonceValue.innerText = mineResult.nonce
        blockTwoHashValue.innerText = bufferedHash.toString("hex")
        verifyFirstBlock()
        verifySecondBlock()
    }
}

function updateFirstBlock() {
    firstBlock = Block.create(version, blockOneData.value, difficulty, genesisBlock.hash)
    firstBlock.nonce = parseInt(blockOneNonceValue.innerText)
    const actualHash = firstBlock.getHash(firstBlock.nonce)
    firstBlock.hash = actualHash
    blockOneHashValue.innerText = actualHash.toString("hex")
}

function updateSecondBlock() {
    secondBlock = Block.create(version, blockTwoData.value, difficulty, firstBlock.hash)
    secondBlock.nonce = parseInt(blockTwoNonceValue.innerText)
    const actualHash = secondBlock.getHash(secondBlock.nonce)
    secondBlock.hash = actualHash
    blockTwoHashValue.innerText = actualHash.toString("hex")
}

function verifyFirstBlock() {
    if (!firstBlock.verify()) {
        document.getElementById("firstBlock").classList.add("redBlock")
        return false
    }
    document.getElementById("firstBlock").classList.remove("redBlock")
    return true
}

function verifySecondBlock() {
    if (!secondBlock.verify()) {
        document.getElementById("secondBlock").classList.add("redBlock")
        return false
    }
    document.getElementById("secondBlock").classList.remove("redBlock")
    return true
}

startWorkerButton.onclick = () => {

    worker.onmessage = function (event) {
        document.getElementById("result").innerHTML = event.data;
        // console.log(event)
    }
    var message = {
        name: "start",
        data: 123
    }
    worker.postMessage(message)
}

stopWorkerButton.onclick = () => {
    worker.terminate();
    worker = undefined;
}
