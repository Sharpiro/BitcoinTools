import gfMaths


def _newField(poly=0x11b, a=0x03):
    exp = [None] * 512
    log = [None] * 256
    x = 1
    for i in range(0, 255):
        exp[i] = (x)
        exp[i + 255] = (x)
        log[x] = (i)
        x = gfMaths.multiply(x, a, poly)
    log[0] = 255
    exp[510] = 0
    exp[511] = 0
    return exp, log

def add(a, b):
    return a ^ b


def subtract(a, b):
    return a ^ b


def multiply(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP[LOG[a] + LOG[b]]


def inverse(x):
    if x == 0:
        return 0
    return EXP[255 - LOG[x]]


def div(a, b):
    return multiply(a, inverse(b))


# init
EXP, LOG = _newField()
