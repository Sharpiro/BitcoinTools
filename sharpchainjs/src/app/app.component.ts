import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import * as crypto from "./shared/crypto_functions"
import { WebWorkerService } from "angular2-web-worker"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private webWorkerService: WebWorkerService) { }

  async ngOnInit() {
    console.log("app componenet reloaded")
    // let sha = crypto.sha256(Buffer.from("datax"))
    // const priv = crypto.getRandomBytes(32)
    // const pub = crypto.getRandomBytes(65)
    const pub = Buffer.from("0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6", "hex")
    console.log(pub)
    let sha = crypto.sha256(pub)
    console.log(sha)
    const rip = crypto.ripemd160(pub)
    console.log(rip);
    const withVersion = Buffer.concat([Buffer.from([0]), rip])
    console.log(withVersion);



    // const result = await this.webWorkerService.run(this.someCPUHeavyFunction, { data: 12 });
    // const promise = this.webWorkerService.run(this.otherFunc, [1, 2]);
    // promise.then(result => console.log(result));
    // console.log(result)
  }

  otherFunc(inputOne: Array<number>): number {
    return inputOne[0]
  }

  someCPUHeavyFunction(input: { data: number }): string {
    console.log(input);
    const max = 1000000000 * 1
    let j = 0
    for (let i = input.data; i <= max; i++) {
      j = i
    }
    return `j.toString()`
  }

  onClick(event) {
    console.log(event);
  }
}