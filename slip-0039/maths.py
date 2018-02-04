def g_add(a, b):
    return a ^ b


def g_subtract(a, b):
    return a ^ b


def g_multiply(a, b, prime=0x11b):
    p = 0
    while a > 0 and b > 0:
        if b & 1 == 1:
            p = p ^ a

        if a & 0x80 >= 128:
            # XOR with the primitive polynomial x ^ 8 + x ^ 4 + x ^ 3 + x + 1 (0b1_0001_1011) – you can change it but it must be irreducible
            a = (a << 1) ^ prime
        else:
            a <<= 1  # equivalent to a * 2
        b >>= 1  # equivalent to b // 2
    return p


def dividePolynomials(a, b):
    quotient = 1
    divisor = b
    dividend = a
    # for _ in range(0, 3):
    # divisor <<= 3
    dividend >>= 3

    quotient <<= 1
    dividend = dividend ^ divisor

    quotient <<= 1
    dividend <<= 1

    quotient <<= 1
    dividend <<= 1

    quotient += 1
    dividend <<= 1
    dividend += 1
    dividend = dividend ^ divisor

    return quotient, dividend


# def inverse(a, p):
#     t = 0
#     newt = 1
#     r = p
#     newr = a
#     while newr != 0:
#         quotient = r // newr
#         # quotient = _extended_gcd_quotient(r, newr)
#         (r, newr) = (newr, r - quotient * newr)
#         (t, newt) = (newt, t - quotient * newt)
#     # if degree(r) > 0:
#     #     return "Either p is not irreducible or a is a multiple of p"
#     return (1 / r) * t
