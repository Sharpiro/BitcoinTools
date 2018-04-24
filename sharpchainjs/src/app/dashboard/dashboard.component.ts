import { Component, OnInit } from '@angular/core';
import { Buffer } from "buffer"
import * as curves from "../shared/curves"
import * as crypto from "../shared/crypto_functions"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const random = "0c1e24e5917779d297e14d45f14e1a1a"
    const words = "army van defense carry jealous true garbage claim echo media make crunch"
    const expectedSeed = "5b56c417303faa3fcba7e57400e120a0ca83ec5a4fc9ffba757fbe63fbd77a89a1a3be4c67196f57c39a88b76373733891bfaba16ed27a813ceed498804c0570"

    const actualSeed = crypto.pbkdf2(Buffer.from(words, "utf8"), Buffer.from("mnemonicSuperDuperSecret", "utf8"))
    console.log(actualSeed.toString("hex"));

    console.log("done");
  }
}