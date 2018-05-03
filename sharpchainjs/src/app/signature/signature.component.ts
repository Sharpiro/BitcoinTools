import { Component, OnInit } from '@angular/core';
import * as crypto from "../shared/crypto_functions"
import * as curves from "../shared/curves"
import * as bitcoin from "../shared/bitcoin"
import * as toastr from "toastr"
import { Buffer } from "buffer"
import { BN } from "bn.js"
import { hexValidator } from '../shared/angular_extensions/customValidators';
import { CustomFormControl } from '../shared/angular_extensions/customFormControl';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  constantK = new BN("340a098bb9702ee3671cf9c7301ba1afb40f5180a1685ff13ade5738a08a0be5", "hex")
  hacking = true

  privateKeyControl = new CustomFormControl('', [hexValidator]);
  publicKeyControl = new CustomFormControl('', [hexValidator]);
  bitcoinAddressControl = new CustomFormControl();
  data1Control = new CustomFormControl('', [hexValidator]);
  data2Control = new CustomFormControl('', [hexValidator]);
  signature1Control = new CustomFormControl('', [hexValidator]);
  signature2Control = new CustomFormControl('', [hexValidator]);

  constructor() {
    this.data1Control.setValue("39f03ee16b6d1d99b0c29676b7ea361f544d7951c6898e0dc9ae03cb584101bd")
    this.data2Control.setValue("4f2c905eef09b389ef6ce6e4de410eb6b7ee3f85d3941e175433cd98bcce7510")
  }

  ngOnInit() { }

  onPrivateKeyInput = () => {
    if (this.privateKeyControl.invalidOrEmpty) {
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
    if (this.publicKeyControl.invalidOrEmpty) {
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
    if (this.privateKeyControl.invalidOrEmpty) {
      toastr.error("must provide a valid private key in hex")
      return
    }
    if (this.data1Control.invalidOrEmpty) {
      toastr.error("must provide valid hex for 'data'")
      return
    }
    if (this.hacking && this.data2Control.invalidOrEmpty) {
      toastr.error("must provide valid hex for 'data2' while 'hacking'")
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
    if (this.data1Control.invalidOrEmpty) {
      toastr.error("must provide valid 'data1' in hex")
      return
    }
    if (this.publicKeyControl.invalidOrEmpty) {
      toastr.error("must provide a valid public key compressed in hex")
      return
    }
    if (this.signature1Control.invalidOrEmpty) {
      toastr.error("must provide valid signature in hex")
      return
    }
    if (this.hacking) {
      if (this.data2Control.invalidOrEmpty) {
        toastr.error("must provide valid data2 in hex while 'hacking'")
        return
      }
      if (this.signature2Control.invalidOrEmpty) {
        toastr.error("must provide valid signature2 in hex while 'hacking'")
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
    if (this.signature1Control.invalidOrEmpty || this.signature2Control.invalidOrEmpty) {
      toastr.error("must provide 2 valid signatures in hex")
      return
    }
    if (this.data1Control.invalidOrEmpty || this.data2Control.invalidOrEmpty) {
      toastr.error("must provide 2 valid data inputs in hex")
      return
    }

    try {
      const data1Buffer = Buffer.from(this.data1Control.value, "hex")
      const data2Buffer = Buffer.from(this.data2Control.value, "hex")
      const signature1Buffer = Buffer.from(this.signature1Control.value, "hex")
      const signature2Buffer = Buffer.from(this.signature2Control.value, "hex")

      const result = curves.hackSignatures(data1Buffer, data2Buffer, signature1Buffer, signature2Buffer)
      toastr.success(`hacked private key: ${result.dA.toString("hex")}`)
    } catch (err) {
      toastr.error(err)
    }
  }
}