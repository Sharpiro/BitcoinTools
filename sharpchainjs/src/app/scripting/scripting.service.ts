import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import "../shared/extensions"

@Injectable()
export class ScriptingService {
  private stack: any[]

  evaluate(source: string): any {
    this.stack = []
    var command = ""
    for (let i = 0; i < source.length; i++) {
      if (source[i] != " " && source[i] != "\n") {
        command += source[i]
        if (i + 1 != source.length)
          continue
      }

      switch (command) {
        case "op_add":
          this.add()
          break;
        case "op_sub":
          this.subtract()
          break;
        case "op_equal":
          this.equal()
          break;
        case "op_dup":
          this.duplicate()
          break;
        default:
          this.stack.push(command)
          break;
      }
      command = ""
    }
    if (this.stack.length != 1) throw "after evaluation, more than 1 values were left on the stack"
    return this.stack[0]
  }

  add() {
    if (this.stack.length < 2) throw "failed to do 'opp_add', invalid stack data"
    const popped = this.popNumbers(2)
    this.stack.push(popped[0] + popped[1])
  }

  subtract() {
    if (this.stack.length < 2) throw "failed to do 'op_sub', invalid stack data"
    const popped = this.popNumbers(2)
    this.stack.push(popped[1] - popped[0])
  }

  equal() {
    if (this.stack.length < 2) throw "failed to do 'op_equal', invalid stack data"
    const firstPop = this.stack.pop()
    const secondPop = this.stack.pop()
    this.stack.push(firstPop == secondPop)
  }

  duplicate() {
    if (this.stack.length < 1) throw "failed to do 'op_dup', invalid stack data"
    const peek = this.stack.peek()
    this.stack.push(peek)
  }

  popNumbers(amount: number): number[] {
    const poppedList: number[] = []
    for (let i = 0; i < amount; i++) {
      const popped = this.stack.pop()
      const numberPoppped = +popped
      if (isNaN(numberPoppped)) {
        throw `expected number, instead got, '${popped}'`
      }
      poppedList.push(numberPoppped)
    }
    return poppedList
  }
}