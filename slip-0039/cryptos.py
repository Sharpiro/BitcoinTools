from hashlib import sha256
import binascii


def getSha256(data):
    dataBytes = bytearray(data, "utf8") if type(data) is str else data
    shaHash = sha256(dataBytes).digest()
    return shaHash