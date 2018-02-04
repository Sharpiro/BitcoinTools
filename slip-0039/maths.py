import math


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


def dividePolynomials(dividend, divisor):
    quotient = 0
    remainder = 0
    dividendIndex = 0
    minDivisorPower = math.floor(math.log(divisor, 2))
    minDivisorValue = 2**minDivisorPower
    maxDividendPower = math.ceil(math.log(dividend + 1, 2))

    while dividendIndex < maxDividendPower:
        while remainder < minDivisorValue and dividendIndex < maxDividendPower:
            bit = getBitAtPosition(
                dividend, maxDividendPower - dividendIndex - 1)
            remainder = (remainder << 1) + 1 if bit else remainder << 1
            quotient <<= 1
            dividendIndex += 1
        if remainder >= minDivisorValue:
            remainder = remainder ^ divisor
            quotient += 1

    return quotient, remainder


def getBitAtPosition(number, position):
    return (number >> position) & 1


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
