import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import * as crypto from "./shared/crypto"
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
    const sha = crypto.sha256(Buffer.from("data"))
    console.log(sha);
    const result = await this.webWorkerService.run(this.someCPUHeavyFunction, { data: 12 });
    // const promise = this.webWorkerService.run(this.otherFunc, [1, 2]);
    // promise.then(result => console.log(result));
    console.log(result)
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
}