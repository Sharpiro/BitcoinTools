import { Component, OnInit } from '@angular/core'
import { CustomFormControl } from '../shared/angularExtensions/customFormControl'
import { hexValidator, mnemonicValidator } from '../shared/angularExtensions/customValidators'
import * as toastr from 'toastr'
import * as crypto from '../shared/crypto_functions'
import * as bitcoin from '../shared/bitcoin'
import { Buffer } from 'buffer'
import { trigger, state, transition, animate, style, keyframes } from '@angular/animations'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ backgroundColor: 'white' })),
      transition('* => in', [
        animate(500, keyframes([
          style({ backgroundColor: 'lightgreen', offset: 0.5 }),
          style({ backgroundColor: 'white', offset: 1.0 }),
        ]))
      ])
    ])
  ]
})
export class WalletComponent implements OnInit {
  entropyControl = new CustomFormControl('', [hexValidator])
  mnemonicControl = new CustomFormControl('', [mnemonicValidator])

  state: any

  constructor() { }

  ngOnInit() {
  }

  logAnimation($event) {
    this.state = ''
    console.log('logged')
  }

  onEntropyInput() {
    this.mnemonicControl.reset()
    if (this.entropyControl.invalidOrEmpty) {
      return
    }
    try {
      const entropyBuffer = Buffer.from(this.entropyControl.value, 'hex')
      const menomnicArray = bitcoin.generateMnemonic(entropyBuffer)
      this.mnemonicControl.setValue(menomnicArray.join(' '))
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onMnemonicInput() {
    this.entropyControl.reset()
    if (this.mnemonicControl.invalidOrEmpty) {
      return
    }
    try {
      const menomnicArray = (<string>this.mnemonicControl.value).split(' ')
      this.entropyControl.setValue('aaff')
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onGenerateClick() {
    this.state = 'in'
    try {
      const entropyBuffer = crypto.getRandomBytes(32)
      this.entropyControl.setValue(entropyBuffer.toString('hex'))
      const menomnicArray = bitcoin.generateMnemonic(entropyBuffer)
      this.mnemonicControl.setValue(menomnicArray.join(' '))
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onDebugClick() {
    console.log(this.mnemonicControl.getError('mnemonic'))
  }
}