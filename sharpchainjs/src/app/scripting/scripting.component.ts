import { Component, OnInit } from '@angular/core';
import { ScriptingService } from './scripting.service';

@Component({
  selector: 'app-scripting',
  templateUrl: './scripting.component.html',
  styleUrls: ['./scripting.component.css']
})
export class ScriptingComponent implements OnInit {
  scriptSig = "ced2c9daba08eb8051af6e6795ad95bd35d54331\n3045022100f50281cb12135170497162be13da70f8bd03c8ffeaefb8c83d85ef2c4b1faa0502201193181047f090c0d689ab59aa8a4e3843cc21177471b34c8d730f1982094859\n03fa42b4756743ad6ca204b5fefc28474d7fc04503f7cb890d8ad4f44c9094549c".toLowerCase()
  scriptPubKey = "OP_DUP\nOP_HASH160\ned751c90784316e60d6ee03a48646a891a976d29\nOP_EQUALVERIFY\nOP_CHECKSIG".toLowerCase()
  result = ""

  constructor(private scriptingService: ScriptingService) { }

  ngOnInit() {
  }

  evaluate() {
    this.result = ""
    if (!this.scriptSig || !this.scriptPubKey) {
      this.result = false.toString()
      return
    }
    this.result = this.scriptingService.evaluate(this.scriptSig, this.scriptPubKey).toString()
  }
}