import { Component, OnInit } from '@angular/core';
import * as curves from "../shared/curve"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var messageHash = Buffer.from("f52c44a5fa08dd6074492a1a3a1e4004e7013bed43c75031a7f138b3cacfad20", "hex")
    const privateKey = Buffer.from("3bbcb81fd08cffda86f2b1fec3955004500be04e30dfa636a70b85b84273ff83")

    const publicKey = curves.getPublicKey(privateKey)
    // const publicKey = Buffer.from("046be401150024a7974a56ea12c0ea3e71f987ea6b76fd9b21bdbe7a924f6f7f797b45ab71487eadc9b42adf8d064139e84c05a57ad6baaf11aa1b58fdf7c65fcb", "hex")

    const sig = curves.sign(messageHash, privateKey)
    const result = curves.verify(messageHash, sig, publicKey)
    console.log(result);
  }
}