import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
import * as bitcoin from "../shared/bitcoin"
import * as toastr from "toastr"
import { Buffer } from "buffer"
import { BN } from "bn.js"
import { ec as EC } from 'elliptic'
import * as Signature from 'elliptic/lib/elliptic/ec/signature'
// const zlib = require('zlib');
import * as zlib from 'zlib'

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  privateKey: string
  publicKey: string
  bitcoinAddress: string
  data1: string = "39f03ee16b6d1d99b0c29676b7ea361f544d7951c6898e0dc9ae03cb584101bd"
  data2: string = "4f2c905eef09b389ef6ce6e4de410eb6b7ee3f85d3941e175433cd98bcce7510"
  signature1: string
  signature2: string = ""
  constantK = new BN("340a098bb9702ee3671cf9c7301ba1afb40f5180a1685ff13ade5738a08a0be5", "hex")
  hacking = true


  constructor() { }

  ngOnInit() { }

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
    if (!this.data1) {
      toastr.error("must provide data in hex")
      return
    }
    if (this.hacking && !this.data2) {
      toastr.error("must provide data2 in hex while 'hacking'")
      return
    }

    let options = this.hacking ? { k: (x) => this.constantK } : undefined

    const dataBuffer1 = Buffer.from(this.data1, "hex")
    const privateKeyBuffer1 = Buffer.from(this.privateKey, "hex")
    const signatureBuffer1 = curves.sign(dataBuffer1, privateKeyBuffer1, options)
    this.signature1 = signatureBuffer1.toString("hex")
    if (!this.hacking) return

    const dataBuffer2 = Buffer.from(this.data2, "hex")
    const privateKeyBuffer2 = Buffer.from(this.privateKey, "hex")
    const signatureBuffer2 = curves.sign(dataBuffer2, privateKeyBuffer2, options)
    this.signature2 = signatureBuffer2.toString("hex")
  }

  onVerifySignatureClick() {
    if (!this.data1) {
      toastr.error("must provide data in hex")
      return
    }
    if (!this.publicKey) {
      toastr.error("must provide public key compressed")
      return
    }
    if (!this.signature1) {
      toastr.error("must provide signature")
      return
    }
    if (this.hacking) {
      if (!this.data2) {
        toastr.error("must provide data2 in hex while 'hacking'")
        return
      }
      if (!this.signature2) {
        toastr.error("must provide signature2 in hex while 'hacking'")
        return
      }
    }
    const dataBuffer1 = Buffer.from(this.data1, "hex")
    const publicKeyBuffer1 = Buffer.from(this.publicKey, "hex")
    const signatureBuffer1 = Buffer.from(this.signature1, "hex")
    const result1 = curves.verify(dataBuffer1, signatureBuffer1, publicKeyBuffer1)
    if (!result1) {
      toastr.error("failed to validate signature 1")
      return
    }

    if (this.hacking) {
      const dataBuffer2 = Buffer.from(this.data2, "hex")
      const publicKeyBuffer2 = Buffer.from(this.publicKey, "hex")
      const signatureBuffer2 = Buffer.from(this.signature2, "hex")
      const result2 = curves.verify(dataBuffer2, signatureBuffer2, publicKeyBuffer2)
      if (!result2) {
        toastr.error("failed to validate signature 2")
        return
      }
    }

    toastr.success("success")
  }

  onHackSignatureClick() {
    if (!this.signature1 || !this.signature2) {
      toastr.error("must provide 2 signatures")
      return
    }
    if (!this.data1 || !this.data2) {
      toastr.error("must provide 2 data inputs")
      return
    }

    const ec = new EC('secp256k1')
    const expectedOptions = { k: (x) => this.constantK }

    const z1 = new BN(this.data1, "hex")
    const sig1 = curves.getSignature(Buffer.from(this.signature1, "hex"))
    const r1 = sig1.r
    const s1 = sig1.s

    const z2 = new BN(this.data2, "hex")
    const sig2 = curves.getSignature(Buffer.from(this.signature2, "hex"))
    const r2 = sig2.r
    const s2 = sig2.s

    const left = z1.sub(z2).umod(ec.curve.n)
    const right = s1.sub(s2).umod(ec.curve.n).invm(ec.curve.n)
    const k = left.mul(right).umod(ec.curve.n)

    const dALeft = s1.mul(k).umod(ec.curve.n).sub(z1).umod(ec.curve.n)
    const dARight = r1.invm(ec.curve.n)
    const dA = dALeft.mul(dARight).umod(ec.curve.n)

    const privateKeyPair = ec.keyFromPrivate(dA.toArrayLike(Buffer))
    const options = { k: (x) => k }
    var actualSignature1 = privateKeyPair.sign(z1.toArrayLike(Buffer), undefined, options)
    var actualSignature2 = privateKeyPair.sign(z2.toArrayLike(Buffer), undefined, options)

    if (!r1.eq(r2)) {
      toastr.error("unhackable: r values are not equal, thus unique 'k' values were used")
      return
    }

    // // https://github.com/yohanes/write-ups/tree/master/rhme2/secure-filesystem-v1.92r1
    // const ec = new EC('p192')
    // const n = ec.curve.n

    // const r1 = new BN("897703036b2e18116b36353d92ac3dd978845fc99a735b8a", "hex")
    // const s1 = new BN("dfd0f4a25b7d529e89ac030c2b681e93831e95a8186823b9", "hex")
    // const m1 = "cat.txt"
    // const z1 = new BN(crypto.sha128(Buffer.from(m1)))

    // const r2 = new BN("897703036b2e18116b36353d92ac3dd978845fc99a735b8a", "hex")
    // const s2 = new BN("3a3a9b3cc5239fdf4572157296903a0237a4aaeeaa8f3d15", "hex")
    // const m2 = "joke.txt"
    // const z2 = new BN(crypto.sha128(Buffer.from(m2)))

    // const left = z1.sub(z2).umod(n)
    // const right = s1.sub(s2).umod(n).invm(n)
    // const k = left.mul(right).umod(n)

    // const dALeft = s1.mul(k).umod(n).sub(z1).umod(n)
    // const dARight = r1.invm(n)
    // const dA = dALeft.mul(dARight).umod(n)

    // const privateKeyPair = ec.keyFromPrivate(dA.toArrayLike(Buffer))
    // const options = { k: (x) => k }
    // var actualSignature1 = privateKeyPair.sign(z1.toArrayLike(Buffer), undefined, options)
    // var actualSignature2 = privateKeyPair.sign(z2.toArrayLike(Buffer), undefined, options)


    // console.log("r's are equal:", r1.toArrayLike(Buffer).toString("hex") === r2.toArrayLike(Buffer).toString("hex"))
    // console.log("k:", k.toArrayLike(Buffer).toString("hex"));
    // console.log("dA:", dA.toArrayLike(Buffer).toString("hex"));

    // console.log('r1:', actualSignature1.r.toString("hex") == r1.toString("hex"));
    // console.log('s1:', actualSignature1.s.toString("hex") == s1.toString("hex"));
    // console.log('r2:', actualSignature2.r.toString("hex") == r2.toString("hex"));
    // console.log('s2:', actualSignature2.s.toString("hex") == s2.toString("hex"));

    // console.log('sig1:', Buffer.from(actualSignature1.toDER()).toString("hex") == this.signature1);
    // console.log('sig2:', Buffer.from(actualSignature2.toDER()).toString("hex") == this.signature2);

    if (Buffer.from(actualSignature1.toDER()).toString("hex") !== this.signature1
      || Buffer.from(actualSignature2.toDER()).toString("hex") !== this.signature2) {
      toastr.error("failure: could not hack signature")
      return
    }
    toastr.success(`hacked private key: ${dA.toArrayLike(Buffer).toString("hex")}`)
  }
}