import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';

export function matchPasswordAsync(control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> {
  const password = control.parent?.get('password')!.value;
  const confirmPassword = control.value;

  return password !== confirmPassword
    ? Promise.resolve({ passwordMismatch: true })
    : Promise.resolve(null);
}

export function validateIf(
  condition: () => boolean,
  validatorOrOpts?: ValidatorFn | ValidatorFn[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!condition() || !validatorOrOpts) {
      return null;
    }

    const validators = Array.isArray(validatorOrOpts) ? validatorOrOpts : [validatorOrOpts];

    for (const validator of validators) {
      const result = validator(control);
      if (result !== null) {
        return result;
      }
    }

    return null;
  };
}
