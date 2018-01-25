"""The following Python implementation of Shamir's Secret Sharing is
released into the Public Domain under the terms of CC0 and OWFa:
https://creativecommons.org/publicdomain/zero/1.0/
http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0

See the bottom few lines for usage. Tested on Python 2 and 3.
"""

from __future__ import division
import random
import functools
import secrets

# 12th Mersenne Prime
# (for this application we want a known prime number as close as
# possible to our security level; e.g.  desired security level of 128
# bits -- too large and all the ciphertext is large; too small and
# security is compromised)
_PRIME = 2**127 - 1
# 13th Mersenne Prime is 2**521 - 1

_rint = functools.partial(random.SystemRandom().randint, 0)


def _eval_at(poly, x, prime):
    '''evaluates polynomial (coefficient tuple) at x, used to generate a
    shamir pool in make_random_shares below.
    '''
    accum = 0
    for coeff in reversed(poly):
        accum *= x
        accum += coeff
        accum %= prime
    return accum


def make_random_shares(minimum, shares, prime=_PRIME):
    '''
    Generates a random shamir pool, returns the secret and the share
    points.
    '''
    if minimum > shares:
        raise ValueError("pool secret would be irrecoverable")
    # poly = [_rint(prime) for i in range(minimum)]
    # poly = [94, 166, 1234]
    poly = [1234, 166, 94]
    prime = 1613
    points = [(i, _eval_at(poly, i, prime)) for i in range(1, shares + 1)]
    return poly[0], points


def _extended_gcd(a, b):
    '''
    division in integers modulus p means finding the inverse of the
    denominator modulo p and then multiplying the numerator by this
    inverse (Note: inverse of A is B such that A*B % p == 1) this can
    be computed via extended Euclidean algorithm
    http://en.wikipedia.org/wiki/Modular_multiplicative_inverse#Computation
    '''

    s = 0
    t = 1
    r = b
    old_s = 1
    old_t = 0
    old_r = aN
    while r != 0:
        quotient = old_r // r
        (old_r, r) = (r, old_r - quotient * r)
        (old_s, s) = (s, old_s - quotient * s)
        (old_t, t) = (t, old_t - quotient * t)
        # quotient = a // b
        # a, b = b,  a % b
        # s, old_s = old_s - quotient * s, s
        # t, old_t = old_t - quotient * t, t
    return old_s, old_t


def _divmod(num, den, p):
    '''compute num / den modulo prime p

    To explain what this means, the return value will be such that
    the following is true: den * _divmod(num, den, p) % p == num
    '''
    inv, _ = _extended_gcd(den, p)
    result = num * inv
    return result

# def _divmod(num, den, p):
#     return num / den


def _lagrange_interpolate(x, x_s, y_s, p):
    '''
    Find the y-value for the given x, given n (x, y) points;
    k points will define a polynomial of up to kth order
    '''
    k = len(x_s)
    assert k == len(set(x_s)), "points must be distinct"

    numerators = []  # avoid inexact division
    denominators = []
    for i in range(k):
        others = list(x_s)
        cur = others.pop(i)
        numerators.append(getProduct(x - o for o in others))
        denominators.append(getProduct(cur - o for o in others))
    denominator = getProduct(denominators)
    divMods = []
    for i in range(k):
        temp = numerators[i] * denominator * y_s[i] % p
        divModX = _divmod(temp, denominators[i], p)
        divMods.append(divModX)
    # divMods = [_divmod(numerators[i] * denominator * y_s[i] % p, denominators[i], p) for i in range(k)]
    complexNum = sum(divMods)
    complexResult = (_divmod(complexNum, denominator, p) + p) % p
    return complexResult


def _lagrange_interpolate_Simple(x, x_s, y_s):
    k = len(x_s)
    assert k == len(set(x_s)), "points must be distinct"

    numerators = []  # avoid inexact division
    denominators = []
    for i in range(k):
        others = list(x_s)
        cur = others.pop(i)
        numerators.append(getProduct(x - o for o in others))
        denominators.append(getProduct(cur - o for o in others))
    simpleRange = [numerators[i] / denominators[i] * y_s[i] for i in range(k)]
    simpleNum = sum(simpleRange)
    return simpleNum


def getProduct(vals):  # upper-case PI -- product of inputs
    accum = 1
    for v in vals:
        accum *= v
    return accum


def recover_secret(shares, prime=_PRIME):
    '''
    Recover the secret from share points
    (x,y points on the polynomial)
    '''
    prime = 1613
    if len(shares) < 2:
        raise ValueError("need at least two shares")
    x_s, y_s = zip(*shares)
    result = _lagrange_interpolate(0, x_s, y_s, prime)
    # result = _lagrange_interpolate_Simple(0, x_s, y_s)
    return result


# a = 10
# b = 20
#         a, b = b,  a % b
#         x, last_x = last_x - quot * x, x
#         y, last_y = last_y - quot * y, y



print(_extended_gcd(240, 46))

# secret, shares = make_random_shares(minimum=3, shares=6)
# print('secret and shares:', secret, shares)
# print('secret recovered from minimum subset of shares', recover_secret([shares[1], shares[3], shares[4]]))
# print('secret recovered from minimum subset of shares', recover_secret(shares[:3]))
# print('secret recovered from a different minimum subset of shares', recover_secret(shares[-3:]))

# secret = 1234
# temp = [(1, 1494), (2, 1942), (3, 2578), (4, 3402), (5, 4414), (6, 5614)]

# print(recover_secret([temp[1], temp[3], temp[4]]))
# print(recover_secret(temp[:3]))
# print(recover_secret(temp[-3:]))

# def tempCreate(secret, x):
#     return secret + 533379*x + 345394*(x**2)

# secret = secrets.randbelow(2**128)
# temp = [(1, tempCreate(secret, 1)), (2, tempCreate(secret, 2)), (3, tempCreate(secret, 3)), (4, tempCreate(secret, 4)), (5, tempCreate(secret, 5)), (6, tempCreate(secret, 6))]

# print(recover_secret([temp[1], temp[3], temp[4]]))
# print(recover_secret(temp[:3]))
# print(recover_secret(temp[-3:]))
