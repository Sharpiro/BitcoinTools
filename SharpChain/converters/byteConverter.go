package converters

import (
	"bytes"
	"encoding/binary"
)

func GetBytes32(number uint32) []byte {
	buffer := new(bytes.Buffer)
	_ = binary.Write(buffer, binary.LittleEndian, number)
	return buffer.Bytes()
}

func GetBytes64(number int64) []byte {
	buffer := new(bytes.Buffer)
	_ = binary.Write(buffer, binary.LittleEndian, number)
	return buffer.Bytes()
}
