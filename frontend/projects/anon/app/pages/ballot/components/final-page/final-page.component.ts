import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BallotsQuery } from '@state/ballots/ballots.query';
import { AnswersStore } from '@state/answers/answers.store';

import { NavigationService } from '../../../../services/navigation.service';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { Ballot } from '@models/elections';
import { UiIcon } from '@ui/components/ui-icons/ui-icons.namespace';
import { HeaderService } from '@services/header.service';
import { WindowService } from '@modules/browser-services/window.service';
import { VotingService } from '@state/voting.service';
import { VoteResponse } from '@models/transaction';
import { BallotsStore } from '@state/ballots/ballots.store';

@Component({
  selector: 'app-final-page',
  templateUrl: './final-page.component.html',
  styleUrls: ['./final-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalPageComponent implements AfterViewInit {

  @ViewChild('stepsRef')
  public stepsTemplate: TemplateRef<HTMLElement>;

  @Input()
  public receipt: VoteResponse;

  public ballot: Ballot = this.ballotsQuery.getActive();

  public isSkipped = this.activatedRoute.snapshot.queryParams['skip'] === 'true';

  public isSingleVoting = this.ballotsQuery.getCount() === 1;

  public completedBallotsCount = this.ballotsQuery.getCompleted().length;

  public skippedBallotsCount = this.ballotsQuery.getSkippedBallots().length;

  public get ballots(): Ballot[] {
    return this.ballotsQuery.getAll();
  }

  public get iconName(): UiIcon.Icons {
    return this.isSkipped ? UiIcon.Stuff.Cross : UiIcon.Stuff.Check;
  }

  public get finalized(): boolean {
    return this.completedBallotsCount + this.skippedBallotsCount === this.ballotsQuery.getCount();
  }

  public get allSkipped(): boolean {
    return this.skippedBallotsCount === this.ballotsQuery.getCount();
  }

  public get allCompleted(): boolean {
    return this.completedBallotsCount === this.ballotsQuery.getCount();
  }

  public get showDefaultView(): boolean {
    return !( this.completedBallotsCount > 0 && this.skippedBallotsCount > 0 );
  }

  public get title(): string {
    if (this.isSingleVoting) {
      return this.isSkipped ? 'Вы пропустили бюллетень' : 'Вы проголосовали';
    }

    if (this.finalized) {
      return this.isSkipped ? 'Вы пропустили все бюллетени' : 'Вы проголосовали по всем бюллетеням';
    }

    return this.isSkipped ? 'Вы пропустили бюллетень' : 'Вы проголосовали';
  }

  public get description(): string {
    if (this.isSingleVoting) {
      return this.isSkipped ? 'Ваш голос по нему не учтен' : 'Спасибо за участие в дистанционном электронном голосовании!';
    }

    if (this.finalized) {
      return this.isSkipped ? 'Ваш голос по ним не учтен' : 'Спасибо за участие в дистанционном электронном голосовании!';
    }

    return this.isSkipped ? 'Ваш голос по нему не учтен' : '';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private ballotsQuery: BallotsQuery,
    private ballotsStore: BallotsStore,
    private navigationService: NavigationService,
    private transferBetweenAppsService: TransferBetweenAppsService,
    private headerService: HeaderService,
    private answersStore: AnswersStore,
    private windowService: WindowService,
    private votingService: VotingService,
  ) {
    this.headerService.setMetadata({
      title: '',
      isShow: false,
    });
  }

  public ngAfterViewInit() {
    this.windowService.scrollToTop();
  }

  public isActive(index: number): boolean {
    const currentBallotId: string = this.ballotsQuery.getActive().id;
    const ballotIdByIndex: string = this.ballotsQuery.getAll()[index].id;

    return currentBallotId === ballotIdByIndex;
  }

  public isCompleted(index: number): boolean {
    return this.ballotsQuery.getAll()[index].completed;
  }

  public navigateToBallot(index: number): void {
    const ballotId = this.ballotsQuery.getAll()[index].id;

    this.navigationService.goToNextBallot(ballotId);
  }

  public gotoNext(): void {
    this.navigationService.goToNextBallot();
  }

  public goBack(): void {
    if (this.isSkipped) {
      this.answersStore.setActive([]);
    }

    this.navigationService.goToCurrentBallot();
  }

  public returnToPortal(): void {
    this.transferBetweenAppsService.transfer();
  }

}
