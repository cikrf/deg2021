import { Spectator, createHostFactory } from '@ngneat/spectator';

import { UiKitModule } from '@ui/ui-kit.module';
import { UiCircleButtonComponent } from './circle-button.component';

describe('ui-kit | circle-button', () => {
  let spectator: Spectator<UiKitModule>;
  const createHost = createHostFactory({
    component: UiCircleButtonComponent,
    imports: [
      UiKitModule,
    ],
    declareComponent: false,
  });

  const defaultName = 'keyboard-arrow-down';
  const defaultSize = 40;
  const defaultClass = 'icon-white-color';

  const customType = 'secondary';
  const customName = 'base-add';
  const customSize = 20;
  const customClass = 'icon-gray-color';

  it('проверяем создание кнопки с дефолтными параметрами', () => {
    spectator = createHost('<ui-circle-button></ui-circle-button>');

    expect(spectator.query('ui-icon')).toHaveAttribute('ng-reflect-name', defaultName);
    expect(spectator.query('ui-icon')).toHaveStyle({width: `${defaultSize}px`, height: `${defaultSize}px`});
    expect(spectator.query('ui-icon')).toHaveClass(defaultClass);
  });

  it('проверяем создание кнопки с пользовательскими параметрами', () => {
    spectator = createHost(`<ui-circle-button type=${customType} name=${customName} [size]="${customSize}"></ui-circle-button>`);

    expect(spectator.query('ui-icon')).toHaveAttribute('ng-reflect-name', customName);
    expect(spectator.query('ui-icon')).toHaveStyle({width: `${customSize}px`, height: `${customSize}px`});
    expect(spectator.query('ui-icon')).toHaveClass(customClass);
  });
});
