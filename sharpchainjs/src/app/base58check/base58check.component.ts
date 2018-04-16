import { Component, OnInit } from '@angular/core';
import * as base58check from "../shared/base58Check"

@Component({
  selector: 'app-base58check',
  templateUrl: './base58check.component.html',
  styleUrls: ['./base58check.component.css']
})
export class Base58checkComponent implements OnInit {
  input: string = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem"
  hex: string = ""
  constructor() { }

  ngOnInit() {
  }

  onSubmit(event) {
    this.hex = base58check.getBytes(this.input).toString("hex")
  }

  onChange($event) {
    this.hex = ""
    this.hex = base58check.getBytes(this.input).toString("hex")
  }
}