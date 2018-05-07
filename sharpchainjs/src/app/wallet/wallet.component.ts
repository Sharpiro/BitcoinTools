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
    trigger('flash', [
      state('flashState', style({ backgroundColor: 'white' })),
      transition('* => flashState', [
        animate(500, keyframes([
          style({ backgroundColor: 'lightgreen', offset: 0.5 }),
          style({ backgroundColor: 'white', offset: 1.0 }),
        ]))
      ])
    ])
  ]
})
export class WalletComponent implements OnInit {
  wordSizeControl = new CustomFormControl()
  entropyControl = new CustomFormControl('', [hexValidator])
  mnemonicControl = new CustomFormControl('', [mnemonicValidator])
  entropyControlState: 'flashState' | '' = ''
  mnemonicControlState: 'flashState' | '' = ''

  constructor() {
    this.wordSizeControl.setValue(24)
  }

  ngOnInit() { }

  onWordSizeInput() {
    this.entropyControl.reset()
    this.mnemonicControl.reset()
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
      this.mnemonicControlState = 'flashState'
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
      const entropyBuffer = bitcoin.getEntropyFromMnemonic(menomnicArray)
      this.entropyControl.setValue(entropyBuffer.toString('hex'))
      this.entropyControlState = 'flashState'
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onGenerateClick() {
    try {
      const temp = 2
      const numOfBytes = 32
      const entropyBuffer = crypto.getRandomBytes(numOfBytes)
      this.entropyControl.setValue(entropyBuffer.toString('hex'))
      this.entropyControlState = 'flashState'
      const menomnicArray = bitcoin.generateMnemonic(entropyBuffer)
      this.mnemonicControl.setValue(menomnicArray.join(' '))
      this.mnemonicControlState = 'flashState'
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onDebugClick() {
    console.log(this.mnemonicControl.getError('mnemonic'))
  }
}