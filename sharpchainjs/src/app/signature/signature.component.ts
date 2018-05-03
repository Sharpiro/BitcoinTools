import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
import * as bitcoin from "../shared/bitcoin"
import * as toastr from "toastr"
import { Buffer } from "buffer"
import { BN } from "bn.js"
import { ec as EC } from 'elliptic'
import * as Signature from 'elliptic/lib/elliptic/ec/signature'
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { hexValidator } from '../shared/Validations/CustomValidators';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  constantK = new BN("340a098bb9702ee3671cf9c7301ba1afb40f5180a1685ff13ade5738a08a0be5", "hex")
  hacking = true

  privateKeyControl = new FormControl('', [hexValidator]);
  publicKeyControl = new FormControl('', [hexValidator]);
  bitcoinAddressControl = new FormControl();
  data1Control = new FormControl('', [hexValidator]);
  data2Control = new FormControl('', [hexValidator]);
  signature1Control = new FormControl('', [hexValidator]);
  signature2Control = new FormControl('', [hexValidator]);

  constructor() {
    this.data1Control.setValue("39f03ee16b6d1d99b0c29676b7ea361f544d7951c6898e0dc9ae03cb584101bd")
    this.data2Control.setValue("4f2c905eef09b389ef6ce6e4de410eb6b7ee3f85d3941e175433cd98bcce7510")
    // this.privateKeyControl.valueChanges.subscribe(this.onPrivateKeyInput)
    // this.publicKeyControl.valueChanges.subscribe(this.onPublicKeyInput)
  }

  ngOnInit() { }

  onPrivateKeyInput = () => {
    if (!this.privateKeyControl.value || this.privateKeyControl.invalid) {
      this.publicKeyControl.reset()
      this.bitcoinAddressControl.reset()
      return
    }
    const privateKeyBuffer = Buffer.from(this.privateKeyControl.value, "hex")
    const publicKeyBuffer = curves.getCompressedPublicKey(privateKeyBuffer)
    this.publicKeyControl.setValue(publicKeyBuffer.toString("hex"))
    this.bitcoinAddressControl.setValue(bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0])))
  }

  onPublicKeyInput = () => {
    this.privateKeyControl.reset()
    if (!this.publicKeyControl.value || this.publicKeyControl.invalid) {
      this.bitcoinAddressControl.reset()
      return
    }
    const publicKeyBuffer = Buffer.from(this.publicKeyControl.value, "hex")
    this.bitcoinAddressControl.setValue(bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0])))
  }

  onGenerateClick() {
    const privateKeyBuffer = crypto.getRandomBytes(32)
    this.privateKeyControl.setValue(privateKeyBuffer.toString("hex"))
    const publicKeyBuffer = curves.getCompressedPublicKey(privateKeyBuffer)
    this.publicKeyControl.setValue(publicKeyBuffer.toString("hex"))
    this.bitcoinAddressControl.setValue(bitcoin.getBitcoinAddress(publicKeyBuffer, Buffer.from([0])))
  }

  onCreateSignatureClick() {
    if (!this.privateKeyControl.value) {
      toastr.error("must provide private key")
      return
    }
    if (!this.data1Control.value) {
      toastr.error("must provide data in hex")
      return
    }
    if (this.hacking && !this.data2Control.value) {
      toastr.error("must provide data2 in hex while 'hacking'")
      return
    }

    let options = this.hacking ? { k: (x) => this.constantK } : undefined

    const dataBuffer1 = Buffer.from(this.data1Control.value, "hex")
    const privateKeyBuffer1 = Buffer.from(this.privateKeyControl.value, "hex")
    const signatureBuffer1 = curves.sign(dataBuffer1, privateKeyBuffer1, options)
    this.signature1Control.setValue(signatureBuffer1.toString("hex"))
    if (!this.hacking) return

    const dataBuffer2 = Buffer.from(this.data2Control.value, "hex")
    const privateKeyBuffer2 = Buffer.from(this.privateKeyControl.value, "hex")
    const signatureBuffer2 = curves.sign(dataBuffer2, privateKeyBuffer2, options)
    this.signature2Control.setValue(signatureBuffer2.toString("hex"))
  }

  onVerifySignatureClick() {
    if (!this.data1Control.value) {
      toastr.error("must provide data in hex")
      return
    }
    if (!this.publicKeyControl.value) {
      toastr.error("must provide public key compressed")
      return
    }
    if (!this.signature1Control.value) {
      toastr.error("must provide signature")
      return
    }
    if (this.hacking) {
      if (!this.data2Control.value) {
        toastr.error("must provide data2 in hex while 'hacking'")
        return
      }
      if (!this.signature2Control.value) {
        toastr.error("must provide signature2 in hex while 'hacking'")
        return
      }
    }
    const dataBuffer1 = Buffer.from(this.data1Control.value, "hex")
    const publicKeyBuffer1 = Buffer.from(this.publicKeyControl.value, "hex")
    const signatureBuffer1 = Buffer.from(this.signature1Control.value, "hex")
    const result1 = curves.verify(dataBuffer1, signatureBuffer1, publicKeyBuffer1)
    if (!result1) {
      toastr.error("failed to validate signature 1")
      return
    }

    if (this.hacking) {
      const dataBuffer2 = Buffer.from(this.data2Control.value, "hex")
      const publicKeyBuffer2 = Buffer.from(this.publicKeyControl.value, "hex")
      const signatureBuffer2 = Buffer.from(this.signature2Control.value, "hex")
      const result2 = curves.verify(dataBuffer2, signatureBuffer2, publicKeyBuffer2)
      if (!result2) {
        toastr.error("failed to validate signature 2")
        return
      }
    }

    toastr.success("success")
  }

  onHackSignatureClick() {
    if (!this.signature1Control.value || !this.signature2Control.value) {
      toastr.error("must provide 2 signatures")
      return
    }
    if (!this.data1Control.value || !this.data2Control.value) {
      toastr.error("must provide 2 data inputs")
      return
    }

    const ec = new EC('secp256k1')
    const expectedOptions = { k: (x) => this.constantK }

    const z1 = new BN(this.data1Control.value, "hex")
    const sig1 = curves.getSignature(Buffer.from(this.signature1Control.value, "hex"))
    const r1 = sig1.r
    const s1 = sig1.s

    const z2 = new BN(this.data2Control.value, "hex")
    const sig2 = curves.getSignature(Buffer.from(this.signature2Control.value, "hex"))
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

    if (Buffer.from(actualSignature1.toDER()).toString("hex") !== this.signature1Control.value
      || Buffer.from(actualSignature2.toDER()).toString("hex") !== this.signature2Control.value) {
      toastr.error("failure: could not hack signature")
      return
    }
    toastr.success(`hacked private key: ${dA.toArrayLike(Buffer).toString("hex")}`)
  }
}