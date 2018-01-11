package main

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"log"
	"math"
	"time"

	"./converters"
)

// const blockMap = map[string]*block{}

type block struct {
	id                uint32 //true
	timestamp         int64  //true
	hash              []byte //false
	nonceHash         []byte //false
	difficulty        uint32 //true
	data              []byte //true
	nonce             uint32 //false
	previousBlockHash []byte //true
}

func (block *block) getBytes() []byte {
	idBytes := converters.GetBytes32(block.id)
	timestampBytes := converters.GetBytes64(block.timestamp)
	difficultyBytes := converters.GetBytes32(block.difficulty)

	allBytes := append(idBytes, timestampBytes...)
	allBytes = append(allBytes, difficultyBytes...)
	allBytes = append(allBytes, block.data...)
	allBytes = append(allBytes, block.previousBlockHash...)

	return allBytes
}

const difficulty = 3

func main() {
	now := time.Now()
	genesisBlock := createGenesisBlock()
	nonce, nonceHash, err := mine(genesisBlock)
	if err != nil {
		log.Fatal(err)
	}
	genesisBlock.nonce = nonce
	genesisBlock.nonceHash = nonceHash

	fmt.Println(genesisBlock.nonceHash)
	firstBlock := createBlock([]byte("first block"), difficulty, genesisBlock.hash, genesisBlock.id)
	_ = firstBlock
	nonce, nonceHash, err = mine(firstBlock)
	fmt.Println(genesisBlock.nonceHash)

	if err != nil {
		log.Fatal(err)
	}
	firstBlock.nonce = nonce
	firstBlock.nonceHash = nonceHash
	elapsed := time.Since(now)

	// temp := firstBlock.getBytes()
	// _ = temp
	// blockMap[firstBlock.hash] = firstBlock
	// fmt.Println(blockMap)

	// data := []byte("block 1")
	// nonce, hash := mine(data, difficulty)
	// fmt.Println(elapsed)
	// hashesPerSecond := int(float64(nonce) / float64(elapsed.Seconds()))
	// fmt.Printf("%v hashes / second\n", hashesPerSecond)
	// fmt.Println(nonce)
	// fmt.Println(hash)
	fmt.Println("done............")
	fmt.Println(elapsed)
}

func createGenesisBlock() *block {
	block := &block{
		id:         0,
		timestamp:  time.Now().Unix(),
		data:       []byte("genesis"),
		difficulty: 1,
	}
	// blockData := fmt.Sprintf("%d%d", block.id, block.timestamp)
	blockData := block.getBytes()
	block.hash = getHash(blockData)
	return block
}

func createBlock(data []byte, difficulty uint32, previousHash []byte, previousID uint32) *block {
	block := &block{
		id:                previousID + 1,
		timestamp:         time.Now().Unix(),
		data:              data,
		previousBlockHash: previousHash,
		difficulty:        difficulty,
	}
	// blockData := fmt.Sprintf("%v%v%v%v", block.id, block.timestamp, block.data, block.previousBlockHash)
	blockData := block.getBytes()
	block.hash = getHash(blockData)
	return block
}

func getHash(data []byte) []byte {
	hasher := sha256.New()
	hasher.Write(data)
	hash := hasher.Sum(nil)
	return hash
}

// func bytesToHexString(data []byte) string {
// 	hashHex := hex.EncodeToString(data)
// 	return hashHex
// }

func mine(block *block) (theNonce uint32, nonceHash []byte, err error) {
	blockDifficulty := int(block.difficulty)
	for nonce := uint32(0); nonce < math.MaxInt32; nonce++ {
		hasher := sha256.New()
		nonceBytes := converters.GetBytes32(nonce)
		fakeData := append(block.data, nonceBytes...)
		hasher.Write(fakeData)
		hashResult := hasher.Sum(nil)
		for j := 0; j < blockDifficulty; j++ {
			if hashResult[j] != 0 {
				break
			}
			if j == blockDifficulty-1 {
				return nonce, hashResult, nil
			}
		}
	}
	return 0, []byte(nil), errors.New("the mine operation was unable to find a valid nonce")
}
