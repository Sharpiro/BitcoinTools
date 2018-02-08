# The following Python implementation of Shamir's Secret Sharing is
# released into the Public Domain under the terms of CC0 and OWFa:
# https://creativecommons.org/publicdomain/zero/1.0/
# http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0

# See the bottom few lines for usage. Tested on Python 2 and 3.

# from __future__ import division
import random
import functools
# from hashlib import sha256
import binascii
import maths
import cryptos
import math
# import secrets

# 12th Mersenne Prime
# (for this application we want a known prime number as close as
# possible to our security level; e.g.  desired security level of 128
# bits -- too large and all the ciphertext is large; too small and
# security is compromised)
# PRIME = 2**127 - 1
# PRIME = 0x11b
PRIME = 0x11b
# 13th Mersenne Prime is 2**521 - 1

randomInt = functools.partial(random.SystemRandom().randint, 0)
basetwo = functools.partial(int, base=2)


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
    poly = [randomInt(prime) for i in range(minimum)]
    # poly = [1234, 166, 94]
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


# def _lagrange_interpolate(x, x_s, y_s, prime):
#     # break the points up into lists of x and y values
#     # x_values, y_values = zip(*points)
#     # initialize f(x) and begin the calculation: f(x) = SUM( y_i * l_i(x) )
#     f_x = 0
#     for i in range(len(x_s)):
#         # evaluate the lagrange basis polynomial l_i(x)
#         numerator, denominator = 1, 1
#         # for j in x_s:
#         for j in range(len(x_s)):
#             # don't compute a polynomial fraction if i equals j
#             if i == j:
#                 continue
#             # compute a fraction & update the existing numerator + denominator
#             numerator = (numerator * (x - x_s[j])) % prime
#             denominator = (denominator * (x_s[i] - x_s[j])) % prime
#         # get the polynomial from the numerator + denominator mod inverse
#         lagrange_polynomial = numerator * _mod_inverse(denominator, prime)
#         # multiply the current y & the evaluated polynomial & add it to f(x)
#         f_x = (prime + f_x + (y_s[i] * lagrange_polynomial)) % prime
#     return f_x


def _lagrange_interpolate(x, x_s, y_s, prime):
    f_x = 0
    for i in range(len(x_s)):
        numerator, denominator = 1, 1
        for j in range(len(x_s)):
            if i == j:
                continue
            numerator = (numerator * (x - x_s[j]))
            denominator = (denominator * (x_s[i] - x_s[j]))
        lagrange_polynomial = numerator / denominator
        f_x = (f_x + (y_s[i] * lagrange_polynomial))
    return f_x % prime


def _recover_secret(shares, prime=PRIME):
    if len(shares) < 2:
        raise ValueError("need at least two shares")
    x_s, y_s = zip(*shares)
    result = _lagrange_interpolate(0, x_s, y_s, prime)
    return result


# SECRET, SHARES = make_random_shares(minimum=3, shares=6)
# print('secret and shares:', SECRET, SHARES)
# should be 240, actually 51.3337
print('secret recovered from minimum subset of shares',
      _recover_secret([(2, 37), (4, 50), (5, 279)]))
print('secret recovered from minimum subset of shares',
      _recover_secret([(1, 253), (2, 37), (3, 158)]))
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

# # wikipedia
# p = 0x11b  # 283
# a = 0b1010011   # x6 + x4 + x + 1       83
# b = 0b11001010  # x7 + x6 + x3 + x      202
# temp = _extended_gcd(p, a)

# # juan
# p = 0b101100011  # 355   2^8 + 2^6 + 2^5 + 2^1 + 1
# a = 0b1010100  # 84      2^6 + 2^4 + 2^2
# b = 0b1101  # 13             2^3+2^2+2^0
