package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

type block struct {
	id                int
	timestamp         int64
	hash              string
	data              string
	previousBlockHash string
}

var blockMap = map[string]*block{}

func main() {
	genesisBlock := createGenesisBlock("genesis")
	blockMap[genesisBlock.hash] = genesisBlock
	firstBlock := createBlock("first block", genesisBlock.hash)
	blockMap[firstBlock.hash] = firstBlock
	fmt.Println(blockMap)
}

func createGenesisBlock(data string) *block {
	block := &block{
		id:        len(blockMap),
		timestamp: time.Now().Unix(),
	}
	blockData := fmt.Sprintf("%d%d", block.id, block.timestamp)
	block.hash = getHash(blockData)
	return block
}

func createBlock(data string, previousHash string) *block {
	block := &block{
		id:                len(blockMap),
		timestamp:         time.Now().Unix(),
		data:              data,
		previousBlockHash: previousHash,
	}
	blockData := fmt.Sprintf("%v%v%v%v", block.id, block.timestamp, block.data, block.previousBlockHash)
	block.hash = getHash(blockData)
	return block
}

func getHash(data string) string {
	hasher := sha256.New()
	hasher.Write([]byte(data))
	var hash = hex.EncodeToString(hasher.Sum(nil))
	return hash
}
