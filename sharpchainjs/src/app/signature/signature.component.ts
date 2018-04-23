import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
// const toastr = require("toastr")
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
  data: string = "39f03ee16b6d1d99b0c29676b7ea361f544d7951c6898e0dc9ae03cb584101bd"
  signature: string

  constructor() { }

  ngOnInit() {
  }

  onGenerateClick() {
    const privateKeyBuffer = crypto.getRandomBytes(32)
    this.privateKey = privateKeyBuffer.toString("hex")
    this.publicKey = curves.getCompressedPublicKey(privateKeyBuffer).toString("hex")
  }

  onCreateSignatureClick() {
    const dataBuffer = Buffer.from(this.data, "hex")
    const privateKeyBuffer = Buffer.from(this.privateKey, "hex")
    const signatureBuffer = curves.sign(dataBuffer, privateKeyBuffer)
    this.signature = signatureBuffer.toString("hex")
  }

  onVerifySignatureClick() {
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