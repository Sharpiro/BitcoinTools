import { Component, OnInit } from '@angular/core';
import { ScriptingService } from './scripting.service';

@Component({
  selector: 'app-scripting',
  templateUrl: './scripting.component.html',
  styleUrls: ['./scripting.component.css']
})
export class ScriptingComponent implements OnInit {
  // source = `2\n7\nop_add\n3\nop_sub\n1\nop_add\n7\nop_add\nop_dup\nop_equal`
  // source = `7\nop_dup\nop_equal`
  source = "029f50f51d63b345039a290c94bffd3180c99ed659ff6ea6b1242bca47eb93b59f OP_HASH160 47862fe165e6121af80d5dde1ecb478ed170565b OP_EQUAL".toLowerCase()
  executedScript = ""
  result = ""

  constructor(private scriptingService: ScriptingService) { }

  ngOnInit() {
    // console.log("scripting componenet reloaded");
  }

  evaluate() {
    this.executedScript = this.source.replace(/\n/g, " ")
    // console.log(this.executedScript);
    this.result = ""
    if (!this.source) {
      this.result = false.toString()
      return
    }
    this.result = this.scriptingService.evaluate(this.source).toString()
  }
}