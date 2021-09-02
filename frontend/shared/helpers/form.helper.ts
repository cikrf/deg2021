import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';

export namespace GasFormHelper {
    export type ControlIteratee = (control: AbstractControl, name: string | number) => void;

    /**
     * Observable из значения контрола
     *
     * @example
     *  const control = new FormControl;
     *  GasFormHelper.controlValueObservable(control) // return Observable
     */
    export function controlValueObservable<T>(control: AbstractControl): Observable<T> {
      return new Observable((subscriber: Subscriber<T>) => {
        subscriber.next(control.value);

        return control.valueChanges.subscribe(subscriber);
      });
    }

    /**
     * Позволяет перебирать контролы на любом уровне вложенности и применять к ним метод
     *
     * @example
     * GasFormHelper.controlForEach(this.form, control => control.markAsDirty(), -1);
     */
    export function controlForEach(control: AbstractControl, iteratee: ControlIteratee, deep: number = 0): void {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((name: string) => {
          const subControl: AbstractControl = control.controls[name];
          iteratee(subControl, name);

          if (deep !== 0) {
            controlForEach(subControl, iteratee, deep - 1);
          }
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach((subControl: AbstractControl, index: number) => {
          iteratee(subControl, index);

          if (deep !== 0) {
            controlForEach(subControl, iteratee, deep - 1);
          }
        });
      }
    }

    /**
     * Добавляет ошибки к контролам при доп валидации
     *
     * @example
     * GasFormHelper.addControlErrors(this.control, { error: `Error: ${GasMathHelper.getUniqueId()}` });
     */
    export function addControlErrors(control: AbstractControl, errors: ValidationErrors | null): void {
      if (errors === null) {
        return;
      }

      control.setErrors(Object.assign({}, control.errors, errors));
    }

    /**
     * Удаляет конкретную ошибку у контролла
     *
     * @example
     * GasFormHelper.removeControlConcreteError(this.control, 'max'});
     */
    export function removeControlConcreteError(control: AbstractControl, errorName: string): void {
      if (control.errors !== null) {
        const errors = Object
          .keys(control.errors)
          .map(key => {
            if (key !== errorName) {
              return control.errors;
            }
              return null;
          })
          .filter(error => error !== null)

        if (errors.length > 0) {
          errors.forEach(error => addControlErrors(control, error));
        } else {
          control.setErrors(null);
        }
      }
    }

    /** Возвращает массив с выбранными элементами */
    export function getFormValue(form: FormGroup): string[] {
      return Object
        .keys(form.value)
        .map(key => form.value[key] ? key : '')
        .filter(key => !!key);
    }
}
