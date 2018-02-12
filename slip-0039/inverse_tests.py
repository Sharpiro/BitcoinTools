import maths

# wikipedia
b = 0b11001010  # x7 + x6 + x3 + x      202
a = 0b1010011   # x6 + x4 + x + 1       83
p = 0x11b  # 283
mult = maths.multiply(a, b, p)
print(mult)
assert mult == 1
inverse = maths.inverse(a, p)
print(inverse)
assert inverse == b
inverse = maths.inverse(b, p)
print(inverse)
assert inverse == a

# juan
p = 0b101100011  # 355   2^8 + 2^6 + 2^5 + 2^1 + 1
a = 0b1010100  # 84      2^6 + 2^4 + 2^2
b = 0b1101  # 13             2^3+2^2+2^0
# expected = 0b110011  # 51  2^5 + 2^4 + 2^1 + 1

mult = maths.multiply(a, b, p)
print(mult)
assert mult == 1
inverse = maths.inverse(a, p)
print(inverse)
assert inverse == b
inverse = maths.inverse(b, p)
print(inverse)
assert inverse == a

# misc
print(maths.inverse(1, 0x11b))
assert maths.inverse(1, 0x11b) == 1
