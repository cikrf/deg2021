import { Spectator, createHostFactory } from '@ngneat/spectator';
import { UiKitModule } from '@ui/ui-kit.module';
import { UiSwitchComponent } from './ui-switch.component';
import { SwitchLabel } from './ui-switch.interface';

describe('ui-kit | switch', () => {
  let spectator: Spectator<UiKitModule>;
  const createHost = createHostFactory({
    component: UiSwitchComponent,
    imports: [
      UiKitModule,
    ],
    declareComponent: false,
  });

  const label: SwitchLabel = {
    default: 'default',
    active: 'active',
    disabled: 'disabled',
  };
  const stringifyLabel = JSON.stringify(label).replace(/"/g, '\'');

  const labelClass = '.ui-switch__label';
  const disabledClass = '._disabled';
  const activeClass = '._active';
  const horizontalClass = '._horizontal';
  const iconActiveColorClass = '.icon-active-color';
  const iconWhiteColorClass = '.icon-white-color';

  const switchTag = 'ui-switch';
  const iconTag = 'ui-icon';

  it('Корректно отображает label', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}"></ui-switch>
    `);

    expect(spectator.query(labelClass)).toHaveText(label.default);
  });

  it('Корректно отображает active label', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}"></ui-switch>
    `);

    spectator.click();

    expect(spectator.element).toHaveClass(activeClass.replace('.', ''));

    expect(spectator.query(labelClass)).toHaveText(label.active);
  });

  it('Корректно отображает active label с инпутом', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}" active></ui-switch>
    `);

    expect(spectator.query(labelClass)).toHaveText(label.active);
  });

  it('Корректно отображает disabled label', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}" nativeDisabled></ui-switch>
    `);

    expect(spectator.query(labelClass)).toHaveText(label.disabled || '');

    spectator.click();

    expect(spectator.query(labelClass)).toHaveText(label.disabled || '');
  });

  it('Корректно работает disabled', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}" nativeDisabled></ui-switch>
    `);

    expect(spectator.element).toHaveClass(disabledClass.replace('.', ''));
    expect(spectator.query(iconTag)).toHaveClass(iconWhiteColorClass.replace('.', ''));

    expect(spectator.query(labelClass)).toHaveText(label.disabled || '');

    spectator.click();

    expect(spectator.query(iconTag)).toHaveClass(iconWhiteColorClass.replace('.', ''));
    expect(spectator.query(labelClass)).toHaveText(label.disabled || '');
  });

  it('Корректно работает horizontal', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}" horizontal></ui-switch>
    `);

    expect(spectator.element).toHaveClass(horizontalClass.replace('.', ''));
  });

  it('Корректно меняется цвет иконки', () => {
    spectator = createHost(`
      <ui-switch [label]="${stringifyLabel}"></ui-switch>
    `);

    expect(spectator.query(iconTag)).toHaveClass(iconActiveColorClass.replace('.', ''));

    spectator.click();

    expect(spectator.query(iconTag)).toHaveClass(iconWhiteColorClass.replace('.', ''));
  });
});
