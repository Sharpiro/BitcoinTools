declare module "pbkdf2" {
    function pbkdf2Sync(password: Buffer, salt: Buffer, iterations: number, outputSizeBytes: number, hashAlg: "sha512")
}