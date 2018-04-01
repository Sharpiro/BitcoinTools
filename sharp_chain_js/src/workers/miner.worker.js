import { Block } from "../block"

onmessage = (event) => {
    const blockData = event.data
    const block = new Block({
        version: blockData.version,
        previousBlockHash: new Buffer(blockData.previousBlockHash),
        data: new Buffer(blockData.data),
        difficulty: blockData.difficulty
    })
    const mineResult = block.mine()
    postMessage(mineResult)
}