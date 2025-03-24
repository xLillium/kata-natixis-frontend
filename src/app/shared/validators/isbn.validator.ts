import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (!value) {
      return null;
    }

    const onlyDigits = /^\d+$/.test(value);
    const validLength = value.length === 10 || value.length === 13;

    if (!onlyDigits || !validLength) {
      return { invalidIsbn: true };
    }

    return null;
  };
}
