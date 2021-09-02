import { fakeAsync, tick } from '@angular/core/testing';
import { Spectator, createHostFactory } from '@ngneat/spectator';

import { UiKitModule } from '@ui/ui-kit.module';
import { UiAvatarComponent } from './ui-avatar.component';

describe('ui-kit | avatar', () => {
  let spectator: Spectator<UiKitModule>;
  const createHost = createHostFactory({
    component: UiAvatarComponent,
    imports: [
      UiKitModule,
    ],
    declareComponent: false,
  });

  const avatar = '.avatar';
  const mokeAvatar = 'ng-component';
  const imgSrc = 'assets/icons/anon-person';
  const DEFAULT_SIZE = 120;
  const LESS_SIZE = 80;
  const MORE_SIZE = 140;

  it('Проверяем, что аватар появляется', fakeAsync(() => {
    spectator = createHost(`<ui-avatar [src]="${imgSrc}"></ui-avatar>`);
    tick(300);

    expect(spectator.query(avatar)).toBeTruthy();
  }));

  it('Проверяем, что появляется заглушка, если изображение не переданно', fakeAsync(() => {
    spectator = createHost(`<ui-avatar></ui-avatar>`);
    tick(300);

    expect(spectator.query(mokeAvatar)).toBeTruthy();
  }));

  it('Проверяем, что размер равен дефолтным значениям', fakeAsync(() => {
    spectator = createHost(`<ui-avatar [src]="${imgSrc}"></ui-avatar>`);
    tick(300);

    expect(spectator.query(avatar)).toHaveStyle({width: `${DEFAULT_SIZE}px`, height: `${DEFAULT_SIZE}px`});
  }));

  it('Проверяем, что если переданный размер больше дефолтного, то устанавливается переданный размер', fakeAsync(() => {
    spectator = createHost(`<ui-avatar [src]="${imgSrc}" [size]="${MORE_SIZE}"></ui-avatar>`);
    tick(300);

    expect(spectator.query(avatar)).toHaveStyle({width: `${MORE_SIZE}px`, height: `${MORE_SIZE}px`});
  }));

  it('Проверяем, что если переданный размер контейнера меньше дефолтного, то устанавливается переданный размер', fakeAsync(() => {
    spectator = createHost(`<ui-avatar [src]="${imgSrc}" [size]="${LESS_SIZE}"></ui-avatar>`);
    tick(300);

    expect(spectator.query(avatar)).toHaveStyle({width: `${LESS_SIZE}px`, height: `${LESS_SIZE}px`});
  }));
});
