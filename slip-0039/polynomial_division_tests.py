import maths

result = maths.dividePolynomials(425, 51)
assert 0b1001 == result[0]
assert 0b10 == result[1]
print(bin(result[0]), bin(result[1]))

result = maths.dividePolynomials(355, 84)
assert 0b100 == result[0]
assert 0b110011 == result[1]
print(bin(result[0]), bin(result[1]))

result = maths.dividePolynomials(84, 51)
assert 0b11 == result[0]
assert 0b1 == result[1]
print(bin(result[0]), bin(result[1]))

result = maths.dividePolynomials(0x11b, 0b1010011)
assert 0b101 == result[0]
assert 0b100 == result[1]
print(bin(result[0]), bin(result[1]))

result = maths.dividePolynomials(0b1010011, 0b100)
assert 0b10100 == result[0]
assert 0b11 == result[1]
print(bin(result[0]), bin(result[1]))

result = maths.dividePolynomials(0b100, 0b11)
print(bin(result[0]), bin(result[1]))
assert 0b11 == result[0]
assert 0b1 == result[1]

result = maths.dividePolynomials(0b11, 0b1)
print(bin(result[0]), bin(result[1]))
assert 0b11 == result[0]
assert 0b0 == result[1]
