import { Component, OnInit } from '@angular/core';
import * as base58check from "../shared/base58Check"
import { FormControl, Validators } from '@angular/forms';
import { Buffer } from "buffer"

@Component({
  selector: 'app-base58check',
  templateUrl: './base58check.component.html',
  styleUrls: ['./base58check.component.css']
})
export class Base58checkComponent implements OnInit {
  // private hexPattern = new RegExp("^(0[xX])?[a-fA-F0-9]+$");
  private hexPattern = new RegExp("^[a-fA-F0-9]+$");

  base58Data: string = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem"
  hexData: string = ""
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  feedback: string[] = []

  constructor() { }

  ngOnInit() {
    this.onBase58Input(null)
  }

  onBase58Input($event) {
    this.feedback = []
    this.hexData = ""
    if (!this.base58Data) {
      this.feedback.push("error: must provide data")
      return
    }
    if (!base58check.isValidBase64(this.base58Data)) {
      this.feedback.push("error: invalid base58check")
      return
    }
    this.hexData = base58check.getBytes(this.base58Data).toString("hex")
    this.feedback.push(base58check.getDataType(this.base58Data))
  }

  onHexInput($event) {
    this.feedback = []
    this.base58Data = ""
    if (!this.hexData) {
      this.feedback.push("error: must provide data")
      return
    }
    if (this.hexData.length % 2 !== 0) {
      this.feedback.push("error: invalid hex length")
      return
    }
    var res = this.hexPattern.test(this.hexData);
    if (!res) {
      this.feedback.push("error: invalid hex")
      return
    }
    var buffer = Buffer.from(this.hexData, "hex")
    this.base58Data = base58check.getString(buffer)
    this.feedback.push(base58check.getDataType(this.base58Data))
  }
}