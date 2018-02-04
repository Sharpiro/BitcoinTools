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


def dividePolynomials(a, b):
    quotient = 0
    divisor = b

    # dividend = a
    dividend = 1
    divMax = math.ceil(math.log(a, 2))

    # index = power
    index = 1
    power = math.floor(math.log(divisor, 2))
    maxValue = 2**power

    # power = math.ceil(math.log(divisor, 2))
    # maxValue = 2**power
    # while dividend >= maxValue:
    #     dividend >>= 1

    # dividend = dividend ^ divisor

    while index < divMax:
        while dividend < maxValue:
            bit = getBitAtPosition(a, divMax - index - 1)
            dividend <<= 1
            if index > power:
                quotient <<= 1
            if bit:
                dividend += 1
            index += 1
            if index >= divMax:
                break
        if dividend >= maxValue:
            dividend = dividend ^ divisor
            quotient += 1

    return quotient, dividend


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
