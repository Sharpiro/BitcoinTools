import random
import functools
# from hashlib import sha256
import binascii
# import logmaths
# import cryptos
# import math
import gfMaths
import secrets

PRIME = 0x11b


randomInt = functools.partial(random.SystemRandom().randint, 0)


def _lagrange_interpolate(xInput, xValues, yValues, prime):
    y = 0
    for i in range(len(xValues)):
        li = 1
        yi = yValues[i]
        for j in range(len(xValues)):
            if i == j:
                continue
            numerator = gfMaths.subtract(xInput, xValues[j])
            denominator = gfMaths.subtract(xValues[i], xValues[j])
            denomInverse = gfMaths.inverse(denominator, prime)
            newLi = gfMaths.multiply(numerator, denomInverse, prime)
            li = gfMaths.multiply(li, newLi, prime)
        l = gfMaths.multiply(li, yi, prime)
        y = gfMaths.add(y, l)
    return y


def _recover_secret(shares, prime=PRIME):
    if len(shares) < 2:
        raise ValueError("need at least two shares")
    x_s, y_s = zip(*shares)
    result = _lagrange_interpolate(0, x_s, y_s, prime)
    return result


def polyDegree(poly):
    for i in range(len(poly) - 1, -1, -1):
        if poly[i] != 0:
            return i
    return 0


def createRandomPolynomial(degree):
    randomBytes = []
    while polyDegree(randomBytes) != degree:
        randomBytes = secrets.token_bytes(degree + 1)
    return bytearray(randomBytes)


def createShares(n, k, secret):
    secretLen = len(secret)
    values = [bytearray(0 for i in range(secretLen)) for j in range(n)]

    # for each byte in the secret
    for i in range(0, secretLen):
        randomPolynomial = createRandomPolynomial(k - 1)
        randomPolynomial[0] = secret[i]

        # for each n shares
        for x in range(1, n + 1):
            temp = gfMaths.evaluatePolynomial(randomPolynomial, x, PRIME)
            values[x - 1][i] = temp

    # dictionary = dict()
    # for i in range(0, x):
    #     dictionary[i] = binascii.hexlify(values[i])
    # return dictionary

    list = [None] * len(values)
    for i in range(0, x):
        list[i] = (i + 1, binascii.hexlify(values[i]))
    return list


secretBytes = "abcde".encode()
# print(secretBytes)
# print(binascii.hexlify(secretBytes))
shares = createShares(6, 3, secretBytes)
print(shares)
# x, y = zip(*shares)
# print(x)
# print(y)
_recover_secret(shares)
# print(binascii.hexlify(createPolynomial(3, "nil")))
# print(degree([1, 2, 3]))

# tests
# for i in range(0, 50000):
#     SECRET, SHARES = make_random_shares(minimum=3, shares=6)
#     result = _recover_secret([SHARES[1], SHARES[3], SHARES[4]])
#     comparison = result == SECRET
#     if not comparison:
#         print("Expected", SECRET, "Actual", result)
#         assert comparison

# print(binascii.hexlify(secret))
# print(binascii.hexlify(checksum))
# print(binascii.hexlify(combinedData))
