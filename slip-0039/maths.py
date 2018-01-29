def g_add(a, b):
    return a ^ b


def g_subtract(a, b):
    return a ^ b


def g_multiply(a, b):
    p = 0
    while a > 0 and b > 0:
        if b & 1 == 1:
            p ^= a

        if a & 0x80 >= 128:
            # XOR with the primitive polynomial x ^ 8 + x ^ 4 + x ^ 3 + x + 1 (0b1_0001_1011) – you can change it but it must be irreducible
            a = (a << 1) ^ 0x11b
        else:
            a <<= 1  # equivalent to a * 2
        b >>= 1  # equivalent to b // 2
    return p
