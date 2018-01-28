# The following Python implementation of Shamir's Secret Sharing is
# released into the Public Domain under the terms of CC0 and OWFa:
# https://creativecommons.org/publicdomain/zero/1.0/
# http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0

# See the bottom few lines for usage. Tested on Python 2 and 3.

from __future__ import division
import random
import functools
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
    return old_s, old_t


def _mod_inverse(k, prime):
    k = k % prime
    if k < 0:
        _, _, r = egcd(prime, -k)
    else:
        _, _, r = egcd(prime, k)
    return (prime + r) % prime


def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)


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

# poly = [94, 166, 1234]
# poly = [1234, 166, 94]
# prime = 1613

SECRET, SHARES = make_random_shares(minimum=3, shares=6)
print('secret and shares:', SECRET, SHARES)
print('secret recovered from minimum subset of shares',
      _recover_secret([SHARES[1], SHARES[3], SHARES[4]]))
print('secret recovered from minimum subset of shares',
      _recover_secret(SHARES[:3]))
print('secret recovered from a different minimum subset of shares',
      _recover_secret(SHARES[-3:]))
