package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"math"
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
	// genesisBlock := createGenesisBlock("genesis")
	// blockMap[genesisBlock.hash] = genesisBlock
	// firstBlock := createBlock("first block", genesisBlock.hash)
	// blockMap[firstBlock.hash] = firstBlock
	// fmt.Println(blockMap)

	data := "data"
	difficulty := 3
	now := time.Now()
	nonce, hash := mine(data, difficulty)
	elapsed := time.Since(now)
	fmt.Println(elapsed)
	hashesPerSecond := int(float64(nonce) / float64(elapsed.Seconds()))
	fmt.Printf("%v hashes / second\n", hashesPerSecond)
	fmt.Println(nonce)
	fmt.Println(hash)
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

func mine(data string, difficulty int) (int, string) {
	for nonce := 0; nonce < math.MaxInt32; nonce++ {
		hasher := sha256.New()
		buf := new(bytes.Buffer)
		num := uint32(nonce)
		_ = binary.Write(buf, binary.LittleEndian, num)
		fakeData := []byte(data)
		fakeData = append(fakeData, buf.Bytes()...)
		hasher.Write(fakeData)
		result := hasher.Sum(nil)
		for j := 0; j < difficulty; j++ {
			if result[j] != 0 {
				break
			}
			if j == difficulty-1 {
				return nonce, hex.EncodeToString(result)
			}
		}
	}
	return -1, ""
}
