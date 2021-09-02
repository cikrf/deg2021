import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-closed-page',
  templateUrl: './closed-page.component.html',
  styleUrls: ['./closed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosedPageComponent {

  public error: string | null = this.activatedRoute.snapshot.queryParamMap.get('error');
  public showDesc: boolean = this.activatedRoute.snapshot.queryParamMap.has('showDesc');
  public errors: {
    [k: string]: {
      title: string;
      desc: string;
      btn?: string;
    };
  } = {
    71: {
      title: 'Голосование завершено',
      desc: 'Ваш голос не принят',
    },
    70: {
      title: 'Повторное голосование',
      desc: 'Ваш голос не принят',
    },
    22: {
      title: 'Некорректный код шифрования',
      desc: '',
    },
    179: {
      title: 'Бюллетень не принят по техническим причинам',
      desc: 'Попробуйте еще раз или обратитесь в службу поддержки',
    },
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private transferBetweenAppsService: TransferBetweenAppsService,
    private headerService: HeaderService,
    private router: Router,
  ) {
    this.headerService.setMetadata({
      title: '',
      isShow: false,
    });
  }

  public back(): void {
    if (this.error && this.errors[this.error].btn) {
      this.router.navigateByUrl('/').then();
      return;
    }
    this.transferBetweenAppsService.transfer();
  }

}
