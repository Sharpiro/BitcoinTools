import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import * as crypto from "./shared/crypto"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    const sha = crypto.sha256(Buffer.from("data"))
    console.log(sha);
  }
}