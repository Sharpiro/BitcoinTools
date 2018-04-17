import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { Stack } from '../shared/stack';
import * as crypto from "../shared/crypto_functions"

@Injectable()
export class ScriptingService {
  private stack: Stack

  evaluate(source: string): any {
    this.stack = new Stack()
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
        case "op_verify":
          this.verify()
          break;
        case "op_equalverify":
          this.equalVerify()
          break;
        case "op_dup":
          this.duplicate()
          break;
        case "op_hash160":
          this.hash160()
          break;
        default:
          this.stack.push(command)
          break;
      }
      for (var x of this.stack.array) {
        console.log(x);
      }
      command = ""
    }
    const result = this.stack.pop()
    if (this.stack.length != 0) throw "after evaluation, more than 1 values were left on the stack"
    return result
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

  verify() {
    if (this.stack.length < 1) throw "failed to do 'op_equal', invalid stack data"
    const firstPop = this.stack.pop()
    if (!firstPop) throw "script failed to verify"
  }

  equalVerify() {
    this.equal()
    this.verify()
  }

  duplicate() {
    if (this.stack.length < 1) throw "failed to do 'op_dup', invalid stack data"
    const peek = this.stack.peek()
    this.stack.push(peek)
  }

  hash160() {
    if (this.stack.length < 1) throw "failed to do 'op_dup', invalid stack data"
    const popped = this.stack.pop()
    const buffer = Buffer.from(popped, "hex")
    const sha = crypto.sha256(buffer)
    const hash = crypto.ripemd160(sha).toString("hex")
    this.stack.push(hash)
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