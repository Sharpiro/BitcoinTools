import math


def g_add(a, b):
    return a ^ b


def g_subtract(a, b):
    return a ^ b


def g_multiply(a, b, prime):
    p = 0
    while a > 0 and b > 0:
        if b & 1 == 1:
            p = p ^ a

        if a & 0x80 >= 128:
            a = (a << 1) ^ prime
        else:
            a <<= 1
        b >>= 1
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


def modularMultInverse(a, p):
    n = 2
    quotientAuxillary = [(None, 0), (None, 1)]
    remainder = a
    dividend = p
    divisor = a

    while remainder != 1:
        quotient, remainder = dividePolynomials(dividend, divisor)
        twoOldAux = quotientAuxillary[n - 2][1]
        oneOldAux = quotientAuxillary[n - 1][1]
        newAux = g_add(twoOldAux, g_multiply(oneOldAux, quotient, p))

        quotientAuxillary.append((quotient, newAux))
        dividend = divisor
        divisor = remainder
        n += 1
    return newAux
