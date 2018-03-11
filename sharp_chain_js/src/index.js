button.onclick = () => {
    console.log("click me bro")
}

var genesisBlock = createGenesisBlock()
console.log(genesisBlock)

function createGenesisBlock() {
    var block = {
        id: 0,
        timestamp: new Date().getDate(),
        data: Buffer.from("genesis", "utf8"),
        difficulty: 1
    }
    // blockData := fmt.Sprintf("%d%d", block.id, block.timestamp)
    // blockData := block.getBytes()
    // block.hash = getHash(blockData)
    return block
}