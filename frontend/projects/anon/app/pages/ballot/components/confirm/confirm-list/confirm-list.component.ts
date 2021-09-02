import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Answer } from '@models/elections';
import { Observable } from 'rxjs';
import { SpriteService, Coordinate } from '@services/sprite.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-list',
  templateUrl: './confirm-list.component.html',
  styleUrls: ['../confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmListComponent {
  @Input()
  public answers: Answer[] = [];

  public coordinates$ = this.spriteService.sprite$;

  constructor(private spriteService: SpriteService) {}

  public getImagePath(image: string): Observable<string | null> {
    return this.spriteService.image(image);
  }

  public getCoordinates(image: string): Observable<Coordinate | null> {
    return this.coordinates$
      .pipe(
        map((coordinates: Record<string, Coordinate> | null) => coordinates && coordinates[image]),
      );
  }
}
