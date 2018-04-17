import { Component, OnInit } from '@angular/core';
import * as base58check from "../shared/base58Check"
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-base58check',
  templateUrl: './base58check.component.html',
  styleUrls: ['./base58check.component.css']
})
export class Base58checkComponent implements OnInit {
  input: string = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem"
  hex: string = ""
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  feedback: string[] = []

  constructor() { }

  ngOnInit() {
    this.onInput(null)
  }

  // onSubmit(event) {
  //   this.hex = base58check.getBytes(this.input).toString("hex")
  // }

  onInput($event) {
    this.feedback = []
    this.hex = ""
    if (!this.input) {
      this.feedback.push("error: must provide data")
      return
    }
    if (!base58check.isValidBase64(this.input)) {
      this.feedback.push("error: invalid base58check")
      return
    }
    this.hex = base58check.getBytes(this.input).toString("hex")
    this.feedback.push(base58check.getDataType(this.input))
  }
}