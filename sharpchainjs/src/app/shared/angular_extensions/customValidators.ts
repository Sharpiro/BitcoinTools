import { AbstractControl, ValidationErrors } from "@angular/forms";

const hexPattern = new RegExp("^[a-fA-F0-9]+$");

export function hexValidator(control: AbstractControl): ValidationErrors | null {
    const hexError = { "hex": true }
    if (!control.value) return null
    if (control.value.length % 2 !== 0) return hexError
    if (!hexPattern.test(control.value)) return hexError
}