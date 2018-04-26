import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
import * as bitcoin from "../shared/bitcoin"
import * as toastr from "toastr"
import { Buffer } from "buffer"

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
}