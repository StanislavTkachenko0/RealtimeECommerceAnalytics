import {AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';

export function matchPasswordAsync(control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> {
  const password = control.parent?.get('password')!.value;
  const confirmPassword = control.value;

  return password !== confirmPassword
    ? Promise.resolve({ passwordMismatch: true })
    : Promise.resolve(null);
}
