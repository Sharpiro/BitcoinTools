import { Component, OnInit } from '@angular/core'
import { Buffer } from 'buffer'
// import * as crypto from "./shared/crypto_functions"
// import * as base58 from "./shared/base58"
import * as base58Check from "./shared/base58Check"
import * as bitcoin from "./shared/bitcoin"
import { WebWorkerService } from "angular2-web-worker"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private webWorkerService: WebWorkerService) { }

  ngOnInit() {
    // const buffer = Buffer.from("this is a Test message")
    // console.log(buffer);
    // const base58Enc = base58.getString(buffer)
    // console.log(base58Enc);
    // const decodedMessage = base58.getBytes(base58Enc).toString()
    // console.log(decodedMessage);

    // const result = await this.webWorkerService.run(this.someCPUHeavyFunction, { data: 12 })
    // const promise = this.webWorkerService.run(this.otherFunc, [1, 2])
    // promise.then(result => console.log(result))
    // console.log(result)

    // const pub = Buffer.from("0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6", "hex")
    // console.log(pub.toString("hex"))
    // const bitcoinAddress = bitcoin.getBitcoinAddress(pub)
    // console.log(bitcoinAddress)
    // const bitcoinAddressBuffer = base58Check.getBytes(bitcoinAddress)
    // const expectedHex = "00010966776006953D5567439E5E39F86A0D273BEED61967F6"
    // const actualHex = bitcoinAddressBuffer.toString("hex")
    // console.log(expectedHex);
    // console.log(actualHex);
    // console.log(expectedHex.toLowerCase() == actualHex);
  }

  isActive(event) {
    console.log(event);
  }

  otherFunc(inputOne: Array<number>): number {
    return inputOne[0]
  }

  someCPUHeavyFunction(input: { data: number }): string {
    console.log(input)
    const max = 1000000000 * 1
    let j = 0
    for (let i = input.data; i <= max; i++) {
      j = i
    }
    return `j.toString()`
  }

  onClick(event) {
    console.log(event)
  }
}