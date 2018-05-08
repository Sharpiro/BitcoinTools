import { Component, OnInit } from '@angular/core'
import { CustomFormControl } from '../shared/angularExtensions/customFormControl'
import { hexValidator, mnemonicValidator, wordSizeValidator } from '../shared/angularExtensions/customValidators'
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
  wordSizeControl = new CustomFormControl('', [wordSizeValidator]) // broken
  entropyControl = new CustomFormControl('', [hexValidator])
  mnemonicControl = new CustomFormControl('', [mnemonicValidator])
  wordSizeControlState: 'flashState' | '' = ''
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
      const entropyBitSize = entropyBuffer.length * 8
      const wordSize = (entropyBitSize / 32 + entropyBitSize) / 11
      if (+this.wordSizeControl.value !== wordSize) {
        this.wordSizeControl.setValue(wordSize)
        this.wordSizeControlState = 'flashState'
      }
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
      if (+this.wordSizeControl.value !== menomnicArray.length) {
        this.wordSizeControl.setValue(menomnicArray.length)
        this.wordSizeControlState = 'flashState'
      }
    } catch (ex) {
      toastr.error(ex)
    }
  }

  onGenerateClick() {
    if (this.wordSizeControl.invalidOrEmpty) return
    try {
      const mnemonicSize = +this.wordSizeControl.value
      const totalBitLength = mnemonicSize * 11
      const checksumLength = totalBitLength % 32
      const numOfBytes = (totalBitLength - checksumLength) / 8
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
}