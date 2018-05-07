import { Component, OnInit } from '@angular/core'
import { Buffer } from 'buffer'
import * as curves from '../shared/curves'
import * as crypto from '../shared/crypto_functions'
import * as bitcoin from '../shared/bitcoin'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const expectedNumber = 64
    const buffer = new Buffer(4)
    buffer.writeInt32BE(expectedNumber, 0)

    const actualNumber = buffer.readUInt32BE(0)
    console.log(expectedNumber)
    console.log(buffer)
    console.log(actualNumber.toString(2))
  }
}