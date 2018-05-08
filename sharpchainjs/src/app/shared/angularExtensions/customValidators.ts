import { AbstractControl, ValidationErrors } from '@angular/forms'
import { wordList } from '../bip39Words'

const hexPattern = new RegExp('^[a-fA-F0-9]+$')
const mnemonicPattern = new RegExp('^[a-z ]+$')

export function hexValidator(control: AbstractControl): ValidationErrors | null {
    const errorLabel = 'hex'
    if (!control.value) return null
    if (control.value.length % 2 !== 0) return { [errorLabel]: 'invalid hex length' }
    if (!hexPattern.test(control.value)) return { [errorLabel]: 'invalid hex characters' }
}

export function mnemonicValidator(control: AbstractControl): ValidationErrors | null {
    const errorLabel = 'mnemonic'
    if (!control.value) return null
    const words = (<string>control.value).split(' ')
    if (words.some(w => !w)) return { [errorLabel]: 'cannot include unnecessary spaces' }
    if (words.length % 3 !== 0) return { [errorLabel]: 'must be a multiple of 3 words' }
    if (words.some(w => w.length < 3 || w.length > 8)) return { [errorLabel]: 'words must be between 3 and 8 characters' }
    if (!mnemonicPattern.test(control.value)) return { [errorLabel]: 'words must be lowercase' }
    const invalidWord = words.find(w => !wordList.includes(w))
    if (invalidWord) return { [errorLabel]: `invalid word ${invalidWord}` }
}

export function wordSizeValidator(control: AbstractControl): ValidationErrors | null {
    const errorLabel = 'wordSize'
    if (!control.value) return null
    const value = +control.value
    if (!value) return { [errorLabel]: 'invalid number' }
    if (value > 93) return { [errorLabel]: 'must be less than 93' }
    if (value % 3 !== 0) return { [errorLabel]: 'must be a multiple of 3' }
}