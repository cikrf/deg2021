import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { filter, map } from 'rxjs/operators';
import { GasInputBoolean, NgOnChange } from '@cikrf/gas-utils/decorators';
import { ACCEPT_RULES_STORAGE_KEY, RETURN_URL_QUERY_KEY } from '../../../constants';
import { WindowService } from '@modules/browser-services/window.service';
import { Observable } from 'rxjs';
import { Rules } from '@models/rules.interface';
import { ControlStatus } from '@enums/control-status.enum';

@Component({
  selector: 'app-rules-confirm-form',
  templateUrl: './rules-confirm-form.component.html',
  styleUrls: ['./rules-confirm-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesConfirmFormComponent {
  @GasInputBoolean()
  @Input()
  public mobile = false;

  @NgOnChange('checkboxes$')
  @Input('checkboxes')
  public checkboxes$!: Observable<Rules['checkBoxes']>;

  public form: FormArray = new FormArray([]);

  public buttonShown$ = this.form.statusChanges.pipe(
    map((status: ControlStatus) => status === ControlStatus.Valid),
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private windowService: WindowService,
  ) {
    this.checkboxes$.pipe(
      filter(Boolean),
    ).subscribe((checkboxes: string[]) => {
      this.form.controls.forEach((c, i) => this.form.removeAt(i));
      checkboxes.forEach((c, i) => {
        this.form.push(new FormControl(false, [Validators.requiredTrue]));
      });
    });
  }

  public confirmRules(): void {
    if (!this.form.valid) {
      return;
    }
    this.windowService.window.sessionStorage.setItem(ACCEPT_RULES_STORAGE_KEY, 'true');
    const returnUrl = this.activatedRoute.snapshot.queryParams[RETURN_URL_QUERY_KEY];
    this.router.navigateByUrl(returnUrl).then();
  }

}
