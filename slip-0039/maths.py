import gfMaths as gfArith
# import gfLogMaths as gfArith
import secrets


def lagrange_interpolate(xInput, xValues, yValues):
    y = 0
    for i in range(len(xValues)):
        li = 1
        yi = yValues[i]
        for j in range(len(xValues)):
            if i == j:
                continue
            numerator = gfArith.subtract(xInput, xValues[j])
            denominator = gfArith.subtract(xValues[i], xValues[j])
            denomInverse = gfArith.inverse(denominator)
            newLi = gfArith.multiply(numerator, denomInverse)
            li = gfArith.multiply(li, newLi)
        l = gfArith.multiply(li, yi)
        y = gfArith.add(y, l)
    return y


def createRandomPolynomial(degree):
    randomBytes = []
    while _polyDegree(randomBytes) != degree:
        randomBytes = secrets.token_bytes(degree + 1)
    return bytearray(randomBytes)


def evaluatePolynomial(polynomial, x):
    result = 0
    for i in range(len(polynomial) - 1, -1, -1):
        product = gfArith.multiply(result, x)
        result = gfArith.add(product, polynomial[i])
    return result


def _polyDegree(poly):
    for i in range(len(poly) - 1, -1, -1):
        if poly[i] != 0:
            return i
    return 0
