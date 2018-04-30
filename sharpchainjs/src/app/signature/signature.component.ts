import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
import * as bitcoin from "../shared/bitcoin"
import * as toastr from "toastr"
import { Buffer } from "buffer"
import { BN } from "bn.js"
import { ec as EC } from 'elliptic'
import * as Signature from 'elliptic/lib/elliptic/ec/signature'

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  privateKey: string
  publicKey: string
  bitcoinAddress: string
  data: string = "39f03ee16b6d1d99b0c29676b7ea361f544d7951c6898e0dc9ae03cb584101bd"
  signature: string
  signature2: string = "3046022100f91dd14ca1004d077f2088a35bf76cee0bb1a8a92d47536782a0808c9ea6a842022100cca6c99f5e65ac111f9e816fc3ab68bf4969117f5391bf8a761ce39620202112"

  constructor() { }

  ngOnInit() {

  }

  onPrivateKeyInput() {
    if (!this.privateKey) {
      this.publicKey = ""
      this.bitcoinAddress = ""
      return
    }
    const privateKeyBuffer = Buffer.from(this.privateKey, "hex")
    const publicKeyBuffer = curves.getCompressedPublicKey(privateKeyBuffer)
    this.publicKey = publicKeyBuffer.toString("hex")
    this.bitcoinAddress = bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0]))
  }

  onPublicKeyInput() {
    this.privateKey = ""
    if (!this.publicKey) {
      this.bitcoinAddress = ""
      return
    }
    const publicKeyBuffer = Buffer.from(this.publicKey, "hex")
    this.bitcoinAddress = bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0]))
  }

  onGenerateClick() {
    const privateKeyBuffer = crypto.getRandomBytes(32)
    this.privateKey = privateKeyBuffer.toString("hex")
    const publicKeyBuffer = curves.getCompressedPublicKey(privateKeyBuffer)
    this.publicKey = publicKeyBuffer.toString("hex")
    this.bitcoinAddress = bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0]))
  }

  onCreateSignatureClick() {
    if (!this.privateKey) {
      toastr.error("must provide private key")
      return
    }
    if (!this.data) {
      toastr.error("must provide data in hex")
      return
    }
    const dataBuffer = Buffer.from(this.data, "hex")
    const privateKeyBuffer = Buffer.from(this.privateKey, "hex")
    const signatureBuffer = curves.sign(dataBuffer, privateKeyBuffer)
    this.signature = signatureBuffer.toString("hex")
  }

  onVerifySignatureClick() {
    if (!this.data) {
      toastr.error("must provide data in hex")
      return
    }
    if (!this.publicKey) {
      toastr.error("must provide public key compressed")
      return
    }
    if (!this.signature) {
      toastr.error("must provide signature")
      return
    }
    const dataBuffer = Buffer.from(this.data, "hex")
    const publicKeyBuffer = Buffer.from(this.publicKey, "hex")
    const signatureBuffer = Buffer.from(this.signature, "hex")
    const result = curves.verify(dataBuffer, signatureBuffer, publicKeyBuffer)
    if (result) {
      toastr.success("success")
    }
    else {
      toastr.error("failure")
    }
  }

  onHackSignatureClick() {
    // if (!this.signature || !this.signature2) {
    //   toastr.error("must provide 2 signatures")
    //   return
    // }

    const ec = new EC('secp256k1')
    const options = { k: (x) => new BN("ff", 16) }

    const privateKey = Buffer.from("5d01aa54544b97d73834d927bca8e0689556c5c5d254e1d53310a76a6603f67a", "hex")
    const n = ec.curve.n

    const sig1 = curves.getSignature(Buffer.from("3046022100b1a2a9a053aed96481bce06f161185386bb9638e15743bd3bcb3ba26b003a140022100d4bd5c1aae01adad813be14911b34eece4d00c66ab0fa918235d4db13d416925", "hex"))
    const r1 = sig1.r
    const s1 = sig1.s
    const z1 = new BN("01", "hex")

    const sig2 = curves.getSignature(Buffer.from("3045022100b1a2a9a053aed96481bce06f161185386bb9638e15743bd3bcb3ba26b003a14002200cecbefe6421e4781a77898ea4b02ad47136f3aad2a110fabe5058b12de53cd0", 'hex'))
    const r2 = sig2.r
    const s2 = sig2.s
    const z2 = new BN("02", "hex")

    const left = z1.sub(z2).mod(n)
    const right = s1.sub(s2).mod(n).invm(n)
    const k = left.mul(right).mod(n)

    const dALeft = s1.mul(k).mod(n).sub(z1).mod(n)
    const dARight = r1.invm(n)
    const dA = dALeft.mul(dARight).mod(n)


    // const r1 = new BN("897703036b2e18116b36353d92ac3dd978845fc99a735b8a", "hex")
    // const s1 = new BN("dfd0f4a25b7d529e89ac030c2b681e93831e95a8186823b9", "hex")
    // const m1 = "cat.txt"
    // const z1 = new BN(crypto.sha128(Buffer.from(m1)))

    // const r2 = new BN("897703036b2e18116b36353d92ac3dd978845fc99a735b8a", "hex")
    // const s2 = new BN("3a3a9b3cc5239fdf4572157296903a0237a4aaeeaa8f3d15", "hex")
    // const m2 = "joke.txt"
    // const z2 = new BN(crypto.sha128(Buffer.from(m2)))

    // const left = z1.sub(z2).mod(n)
    // const right = s1.sub(s2).invm(n)
    // const k = left.mul(right).mod(n)

    // const dALeft = s1.mul(k).mod(n).sub(z1)
    // const dARight = r1.invm(n)
    // const dA = dALeft.mul(dARight).mod(n)

    var temp = curves.sign(Buffer.from("01", "hex"), dA.toArrayLike(Buffer))
    console.log("r's are equal:", r1.toArrayLike(Buffer).toString("hex") === r2.toArrayLike(Buffer).toString("hex"))

    console.log(k.toArrayLike(Buffer).toString("hex"));
    console.log(dA.toArrayLike(Buffer).toString("hex"));
    console.log(temp.toString("hex"));

  }
}