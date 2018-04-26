declare module "pbkdf2" {
    import { Buffer } from "buffer"

    function pbkdf2Sync(password: Buffer, salt: Buffer, iterations: number, outputSizeBytes: number, hashAlg: "sha512")
}