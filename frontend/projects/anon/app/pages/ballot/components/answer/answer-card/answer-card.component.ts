import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';

import { Answer } from '@models/elections';
import { UiFormControlComponent } from '@ui/components/core/ui-form-control.component';
import { ControlStatus } from '@enums/control-status.enum';
import { SpriteService } from '@services/sprite.service';
import { AnswerCard } from '../answer-card.namespace';
import { NgOnInit } from '@cikrf/gas-utils/decorators';

@Component({
  selector: 'app-answer-card',
  templateUrl: './answer-card.component.html',
  styleUrls: ['./answer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerCardComponent extends UiFormControlComponent<boolean> {
  @ViewChild('voteCard')
  public voteCard: ElementRef;

  @Output('onDisabledClick')
  public onDisabledClick$ = new EventEmitter<void>();

  @Input()
  public answer: Answer;

  @Input()
  public maxMarks: number;

  @Input()
  public currentHeight: number;

  @NgOnInit()
  public init$!: Observable<void>;

  @HostBinding('class._unavailable')
  public get unavailableAnswer(): boolean {
    return this.answer?.disabled;
  }

  public buttonType$: Observable<AnswerCard.CircleButton> = this.status$
    .pipe(
      startWith(ControlStatus.Disabled),
      map((status: ControlStatus) => status === ControlStatus.Disabled ? 'primary' : 'secondary'),
    );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ControlStatus = ControlStatus;

  public image$ = this.init$
    .pipe(
      filter(() => !!this.answer.image),
      switchMap(() => this.spriteService.image(this.answer.image)),
    );

  constructor(
    /** контролл используется в шаблоне */
    @Self() @Optional() public ngControl: NgControl,
    private spriteService: SpriteService,
  ) {
    super(ngControl);
  }

  public isActiveStatus(status: string | ControlStatus): boolean {
    return status !== ControlStatus.Disabled;
  }

  public onDisabledClick(): void {
    this.onDisabledClick$.emit();
  }

  public clickOnDescription(): void {
  }
}
