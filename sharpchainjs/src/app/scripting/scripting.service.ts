import { Injectable } from '@angular/core'
import { Buffer } from 'buffer'
import { Stack } from '../shared/stack'
import * as crypto from '../shared/crypto_functions'
import * as curves from '../shared/curves'

@Injectable()
export class ScriptingService {
  private stack: Stack

  evaluate(scriptSig: string, scriptPubKey: string): any {
    this.stack = new Stack()
    this.evaluateScript(scriptSig)
    this.evaluateScript(scriptPubKey)

    const result = this.stack.pop()
    return result
  }

  private evaluateScript(script: string): void {
    let command = ''
    for (let i = 0; i < script.length; i++) {
      if (script[i] !== ' ' && script[i] !== '\n') {
        command += script[i]
        if (i + 1 !== script.length)
          continue
      }

      switch (command) {
        case 'op_add':
          this.add()
          break
        case 'op_sub':
          this.subtract()
          break
        case 'op_equal':
          this.equal()
          break
        case 'op_verify':
          this.verify()
          break
        case 'op_equalverify':
          this.equalVerify()
          break
        case 'op_dup':
          this.duplicate()
          break
        case 'op_hash160':
          this.hash160()
          break
        case 'op_checksig':
          this.checkSignature()
          break
        default:
          this.stack.push(command)
          break
      }

      command = ''
    }
    // for (var x of this.stack.array) {
    //   console.log(x);
    // }
    // const result = this.stack.pop()

    // if (this.stack.length != 0) throw "after evaluation, more than 1 values were left on the stack"
    // return result
  }

  private add() {
    if (this.stack.length < 2) throw new Error('failed to do \'opp_add\', invalid stack data')
    const popped = this.popNumbers(2)
    this.stack.push(popped[0] + popped[1])
  }

  private subtract() {
    if (this.stack.length < 2) throw new Error('failed to do \'op_sub\', invalid stack data')
    const popped = this.popNumbers(2)
    this.stack.push(popped[1] - popped[0])
  }

  private equal() {
    if (this.stack.length < 2) throw new Error('failed to do \'op_equal\', invalid stack data')
    const firstPop = this.stack.pop()
    const secondPop = this.stack.pop()
    this.stack.push(firstPop === secondPop)
  }

  private verify() {
    if (this.stack.length < 1) throw new Error('failed to do \'op_equal\', invalid stack data')
    const firstPop = this.stack.pop()
    if (!firstPop) throw new Error('script failed to verify')
  }

  private equalVerify() {
    this.equal()
    this.verify()
  }

  private duplicate() {
    if (this.stack.length < 1) throw new Error('failed to do \'op_dup\', invalid stack data')
    const peek = this.stack.peek()
    this.stack.push(peek)
  }

  private hash160() {
    if (this.stack.length < 1) throw new Error('failed to do \'op_dup\', invalid stack data')
    const popped = this.stack.pop()
    const buffer = Buffer.from(popped, 'hex')
    const sha = crypto.sha256(buffer)
    const hash = crypto.ripemd160(sha).toString('hex')
    this.stack.push(hash)
  }

  private checkSignature() {
    if (this.stack.length < 3) throw new Error('failed to do \'op_checksig\', invalid stack data')
    const publicKey = this.stack.pop()
    const hashSignature = this.stack.pop()
    const hash = this.stack.pop()
    const publicKeyBuffer = Buffer.from(publicKey, 'hex')
    const hashSigBuffer = Buffer.from(hashSignature, 'hex')
    const hashBuffer = Buffer.from(hash, 'hex')
    const result = curves.verify(hashBuffer, hashSigBuffer, publicKeyBuffer)
    this.stack.push(result)
  }

  private popNumbers(amount: number): number[] {
    const poppedList: number[] = []
    for (let i = 0; i < amount; i++) {
      const popped = this.stack.pop()
      const numberPoppped = +popped
      if (isNaN(numberPoppped)) {
        throw new Error(`expected number, instead got, '${popped}'`)
      }
      poppedList.push(numberPoppped)
    }
    return poppedList
  }
}