import { Spectator, createHostFactory } from '@ngneat/spectator';

import { UiKitModule } from '@ui/ui-kit.module';
import { UiCardComponent } from './ui-card.component';

describe('ui-kit | card', () => {
  let spectator: Spectator<UiKitModule>;
  const createHost = createHostFactory({
    component: UiCardComponent,
    imports: [
      UiKitModule,
    ],
    declareComponent: false,
  });

  const control = 'Content of control';
  const header = 'Content of header';
  const content = 'Content';

  const activeClass = '_active';
  const errorClass = '_error';
  const disabledClass = '_disabled';

  const card = `
    <ui-card>
      <ui-card-control>${control}</ui-card-control>
      <ui-card-header>${header}</ui-card-header>
      <ui-card-content>${content}</ui-card-content>
    </ui-card>
  `;

  it('Проверяем, что карточка отображается на странице', () => {
    spectator = createHost(card);

    expect(spectator.query('ui-card-control')).toHaveText(control);
    expect(spectator.query('ui-card-header')).toHaveText(header);
    expect(spectator.query('ui-card-content')).toHaveText(content);
  });

  it('Проверяем, корректное переключение состояние активности', () => {
    spectator = createHost(card);

    expect(spectator.element).not.toHaveClass(activeClass);

    spectator.debugElement.componentInstance.active = true;
    spectator.detectChanges();

    expect(spectator.element).toHaveClass(activeClass);
  });

  it('Проверяем, корректное переключение состояние ошибки', () => {
    spectator = createHost(card);

    expect(spectator.element).not.toHaveClass(errorClass);

    spectator.debugElement.componentInstance.error = true;
    spectator.detectChanges();

    expect(spectator.element).toHaveClass(errorClass);
  });

  it('Проверяем, корректное переключение состояние дизейбла', () => {
    spectator = createHost(card);

    expect(spectator.element).not.toHaveClass(disabledClass);

    spectator.debugElement.componentInstance.disabled = true;
    spectator.detectChanges();

    expect(spectator.element).toHaveClass(disabledClass);
  });
});
