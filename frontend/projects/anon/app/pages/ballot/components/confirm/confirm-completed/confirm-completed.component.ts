import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Ballot } from '@models/elections';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { UiButton } from '@ui/components/ui-button/button.enum';
import { NavigationService } from '../../../../../services/navigation.service';

@Component({
  selector: 'app-confirm-completed',
  templateUrl: './confirm-completed.component.html',
  styleUrls: ['../confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmCompletedComponent {
  @Input()
  public hasNext = false;

  /** Добавить логики, чтоб показывался пропуск а так же обновить визуал, будет сделано в рамках задачи Кости Лебедева */
  @Input('skip')
  public isSkip = false;

  constructor(
    private transferBetweenAppsService: TransferBetweenAppsService<undefined, {
      ballotIds: Ballot['id'][];
    }>,
    private router: Router,
    private navigationService: NavigationService,
  ) {
  }

  public gotoList(): void {
    this.router.navigate(['/']).then();
  }

  public gotoNext(): void {
    this.navigationService.goToNextBallot();
  }

  public gotoMain(): void {
    this.transferBetweenAppsService.transfer();
  }

  //TODO: добавить логику когда будет информация
  public goToStatistic(): void {
    console.log('Пока непонятно куда должна вести эта кнопка');
  }
}
