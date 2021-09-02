import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Language } from '@models/elections/language.model';
import { LanguageService } from '../../../../services/language.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Ballot } from '@models/elections';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageComponent implements OnInit {
  @Input()
  public languages: Language[];

  @Input()
  public current: Language['code'];

  public defaultLanguage: Language = new Language({
    name: 'Русский',
    code: 0,
  });

  constructor(
    private languageService: LanguageService,
  ) {
  }

  public ngOnInit() {
    const lang = this.languageService.getLanguage();
    if (this.current !== lang && this.languages.map(({ code }) => code).includes(lang)) {
      this.change(lang);
    }
  }

  public change(language: Language | Language['code']): void {
    const code: Language['code'] = typeof language === 'number' ? language : language.code;
    if (this.current === code) {
      return;
    }
    this.languageService.changeActiveBallotLanguage(code);
  }

}
