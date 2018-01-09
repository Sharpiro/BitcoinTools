package test

import (
	"testing"

	"../converters"
)

func TestByte32(tester *testing.T) {
	idBytes := converters.GetBytes32(0)
	if len(idBytes) != 4 {
		tester.Errorf("array length should not be zero, instead was %v", len(idBytes))
	}
}

func TestByte46(tester *testing.T) {
	idBytes := converters.GetBytes64(0)
	if len(idBytes) != 8 {
		tester.Errorf("array length should not be zero, instead was %v", len(idBytes))
	}
}
