import { Component, OnInit } from '@angular/core';
import { ScriptingService } from './scripting.service';

@Component({
  selector: 'app-scripting',
  templateUrl: './scripting.component.html',
  styleUrls: ['./scripting.component.css']
})
export class ScriptingComponent implements OnInit {
  source = `2\n7\nop_add\n3\nop_sub\n1\nop_add\n7\nop_add\nop_dup\nop_equal`
  // source = `7\nop_dup\nop_equal`
  executedScript = ""
  result = ""

  constructor(private scriptingService: ScriptingService) { }

  ngOnInit() {
    // console.log("scripting componenet reloaded");
  }

  evaluate() {
    this.executedScript = this.source.replace(/\n/g, " ")
    console.log(this.executedScript);
    this.result = ""
    if (!this.source) {
      this.result = false.toString()
      return
    }
    this.result = this.scriptingService.evaluate(this.source).toString()
  }
}