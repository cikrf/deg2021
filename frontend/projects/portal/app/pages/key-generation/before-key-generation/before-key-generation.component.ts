import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderService } from '@services/header.service';
import { RETURN_URL_QUERY_KEY } from '../../../constants';

@Component({
  selector: 'app-prekeygeneration',
  templateUrl: './before-key-generation.component.html',
  styleUrls: ['./before-key-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeforeKeyGenerationComponent {
  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.headerService.setMetadata(
      {
        title: 'Ваша личность подтверждена',
        isShow: true,
      },
    );
  }

  public gotoProcess(): void {
    setTimeout(() => {
      if (this.activatedRoute.snapshot.queryParams[RETURN_URL_QUERY_KEY]) {
        this.router.navigateByUrl(
          this.activatedRoute.snapshot.queryParams[RETURN_URL_QUERY_KEY],
        ).then();
        return;
      }
      this.router.navigate(['process'], {
        relativeTo: this.activatedRoute,
        queryParams: this.activatedRoute.snapshot.queryParams,
      }).then();
    });
  }
}
