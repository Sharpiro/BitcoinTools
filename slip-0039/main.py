import random
import functools
import binascii
# import logmaths
# import cryptos
import maths
import secrets


def createShares(n, k, secret):
    secretLen = len(secret)
    values = [bytearray(0 for i in range(secretLen)) for j in range(n)]

    # for each byte in the secret
    for i in range(0, secretLen):
        randomPolynomial = maths.createRandomPolynomial(k - 1)
        randomPolynomial[0] = secret[i]

        # for each n shares
        for x in range(1, n + 1):
            temp = maths.evaluatePolynomial(randomPolynomial, x)
            values[x - 1][i] = temp

    list = [None] * len(values)
    for i in range(0, len(values)):
        list[i] = (i + 1, binascii.hexlify(values[i]))
    return list


def _recover_secret(shares):
    numberOfShares = len(shares)
    if numberOfShares < 2:
        raise ValueError("need at least two shares")
    sharesBytes = list(map(lambda x: (x[0], binascii.unhexlify(x[1])), shares))
    secretLength = len(sharesBytes[0][1])
    secret = bytearray([0] * secretLength)

    # for each byte in the secret
    for i in range(secretLength):
        values = [[0 for i in range(2)] for j in range(numberOfShares)]

        # for each k shares
        for j in range(numberOfShares):
            values[j][0] = sharesBytes[j][0]
            values[j][1] = sharesBytes[j][1][i]
        xValues, yValues = zip(*values)
        interpolation = maths.lagrange_interpolate(
            0, xValues, yValues)
        secret[i] = interpolation
    return secret


# tests
for i in range(0, 1000):
    randomLength = secrets.randbelow(2**6 // 2) + 1
    secretBytes = secrets.token_bytes(randomLength)
    # print(binascii.hexlify(secretBytes))
    shares = createShares(6, 3, secretBytes)
    assert secretBytes == _recover_secret(shares)
    assert secretBytes == _recover_secret(shares[:3])
    assert secretBytes == _recover_secret(shares[-3:])
    assert secretBytes == _recover_secret([shares[1], shares[3], shares[4]])
print("finished successfully")
