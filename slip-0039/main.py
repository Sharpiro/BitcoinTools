# The following Python implementation of Shamir's Secret Sharing is
# released into the Public Domain under the terms of CC0 and OWFa:
# https://creativecommons.org/publicdomain/zero/1.0/
# http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0

# See the bottom few lines for usage. Tested on Python 2 and 3.

# from __future__ import division
import random
import functools
# from hashlib import sha256
# import binascii
import maths
# import secrets

# 12th Mersenne Prime
# (for this application we want a known prime number as close as
# possible to our security level; e.g.  desired security level of 128
# bits -- too large and all the ciphertext is large; too small and
# security is compromised)
PRIME = 2**127 - 1
# 13th Mersenne Prime is 2**521 - 1

R_INT = functools.partial(random.SystemRandom().randint, 0)


def _eval_at(poly, x, prime):
    #    evaluates polynomial (coefficient tuple) at x, used to generate a
    #     shamir pool in make_random_shares below.

    accum = 0
    for coeff in reversed(poly):
        accum *= x
        accum += coeff
        accum %= prime
    return accum


def make_random_shares(minimum, shares, prime=PRIME):
    # Generates a random shamir pool, returns the secret and the share
    # points.

    if minimum > shares:
        raise ValueError("pool secret would be irrecoverable")
    poly = [R_INT(prime) for i in range(minimum)]
    points = [(i, _eval_at(poly, i, prime)) for i in range(1, shares + 1)]
    return poly[0], points


def _extended_gcd(a, b):
    s, old_s = 0, 1
    t, old_t = 1, 0
    r, old_r = b, a
    while r != 0:
        quotient = old_r // r
        (old_r, r) = (r, old_r - quotient * r)
        (old_s, s) = (s, old_s - quotient * s)
        (old_t, t) = (t, old_t - quotient * t)
    return old_s, r, old_t


def _egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    g, y, x = _egcd(b % a, a)
    return (g, x - (b // a) * y, y)


def _mod_inverse(k, prime):
    k = k % prime
    if k < 0:
        _, _, r = _egcd(prime, -k)
        # _, _, r = _extended_gcd(prime, -k)
    else:
        _, _, r = _egcd(prime, k)
        # _, _, r = _extended_gcd(prime, k)
    return (prime + r) % prime


def _lagrange_interpolate(x, x_s, y_s, prime):
    # break the points up into lists of x and y values
    # x_values, y_values = zip(*points)
    # initialize f(x) and begin the calculation: f(x) = SUM( y_i * l_i(x) )
    f_x = 0
    for i in range(len(x_s)):
        # evaluate the lagrange basis polynomial l_i(x)
        numerator, denominator = 1, 1
        # for j in x_s:
        for j in range(len(x_s)):
            # don't compute a polynomial fraction if i equals j
            if i == j:
                continue
            # compute a fraction & update the existing numerator + denominator
            numerator = (numerator * (x - x_s[j])) % prime
            denominator = (denominator * (x_s[i] - x_s[j])) % prime
        # get the polynomial from the numerator + denominator mod inverse
        lagrange_polynomial = numerator * _mod_inverse(denominator, prime)
        # multiply the current y & the evaluated polynomial & add it to f(x)
        f_x = (prime + f_x + (y_s[i] * lagrange_polynomial)) % prime
    return f_x


def _recover_secret(shares, prime=PRIME):
    if len(shares) < 2:
        raise ValueError("need at least two shares")
    x_s, y_s = zip(*shares)
    result = _lagrange_interpolate(0, x_s, y_s, prime)
    # result = _lagrange_interpolate_Simple(0, x_s, y_s)
    return result


# print(_extended_gcd(240, 46))
# print(_egcd(240, 46))

# poly = [94, 166, 1234]
# poly = [1234, 166, 94]
# prime = 1613

# SECRET, SHARES = make_random_shares(minimum=3, shares=6)
# print('secret and shares:', SECRET, SHARES)
# print('secret recovered from minimum subset of shares',
#       _recover_secret([SHARES[1], SHARES[3], SHARES[4]]))
# print('secret recovered from minimum subset of shares',
#       _recover_secret(SHARES[:3]))
# print('secret recovered from a different minimum subset of shares',
#       _recover_secret(SHARES[-3:]))

# secret = bytearray.fromhex(
#     "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08")
# checksum = sha256(secret).digest()[:2]
# combinedData = secret + checksum


# print(binascii.hexlify(secret))
# print(binascii.hexlify(checksum))
# print(binascii.hexlify(combinedData))


# print(maths.g_add(0x53, 0xca))
# print(maths.g_subtract(0x53, 0xca))

# 0xca 202
# 0x53 83
# 0x11b 283

# print(maths.g_multiply(84, 13, 0b101100011))
# print(maths.inverse(84, 0b101100011))

# wikipedia
# B = 0b11001010  # x7 + x6 + x3 + x      202
# A = 0b1010011   # x6 + x4 + x + 1       83
# P = 0x11b  # 283
# inverse = _extended_gcd(A, P)
# assert B == inverse
# print(maths.g_multiply(inverse, A, P))

# juan
# p = 0b101100011  # 355   2^8 + 2^6 + 2^5 + 2^1 + 1
# a = 0b1010100  # 84      2^6 + 2^4 + 2^2
# expected = 0b110011 #51  2^5 + 2^4 + 2^1 + 1

# print(maths.g_multiply(a, 4, p))
# print(maths.g_multiply(4, expected, p))
# b = 0b1101  # 13         2^3 + 2^2 + 2^0
# print(maths.g_multiply(a, b, 0b101100011))
# actual = maths.dividePolynomials(p, a)
# print(actual)
# print(maths.dividePolynomials(a, actual))


temp = maths.dividePolynomials(425, 51)
print(bin(temp[0]), bin(temp[1]))
