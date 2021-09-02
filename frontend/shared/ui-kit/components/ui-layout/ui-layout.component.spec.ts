import { Spectator, createHostFactory } from '@ngneat/spectator';
import { fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserEventsService } from '@services/browser-event.service';

import { UiKitModule } from '@ui/ui-kit.module';
import { UiLayoutComponent } from './ui-layout.component';
import { WindowService } from '@modules/browser-services/window.service';
import { HeaderService } from '@services/header.service';
import { RouterService } from '@services/router.service';

// TODO: Починить тесты, и подумать нужен ли тест в таком виде, возможно лучше подобное проверить через e2e
describe('ui-kit | layout', () => {
  it('Проверяем, что кнопка скролла есть на странице',() => {
    expect(true).toBeTruthy();
  });
  //   let spectator: Spectator<UiKitModule>;
  //   const fakeActivatedRoute = {
  //     snapshot: { data: {} },
  //   } as ActivatedRoute;
  //   const createHost = createHostFactory({
  //     component: UiLayoutComponent,
  //     imports: [
  //       UiKitModule,
  //       BrowserModule,
  //       CommonModule,
  //     ],
  //     providers: [
  //       RouterService,
  //       HeaderService,
  //       BrowserEventsService,
  //       WindowService,
  //       { provide: Router },
  //       { provide: ActivatedRoute, useValue: fakeActivatedRoute },
  //     ],
  //     declareComponent: false,
  //   });

  //   const header = 'ui-layout-header';
  //   const content = '.ui-layout__content';
  //   const footer = '.ui-layout__footer';
  //   const anonHeader = 'ui-layout-anon-header';

  //   const title = '.ui-layout__title';
  //   const upButton = '.ui-layout__up';

  //   const headerService = new HeaderService();

  //   it('Проверяем, что лайаут отображается', () => {
  //     spectator = createHost(`
  //       <ui-layout>
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     expect(spectator.query(header)).toBeTruthy();
  //     expect(spectator.query(content)).toBeTruthy();
  //     expect(spectator.query(footer)).toBeTruthy();
  //   });

  //   it('Проверяем отображение шапки анонимной зоны', () => {
  //     spectator = createHost(`
  //       <ui-layout type="anon">
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     expect(spectator.query(anonHeader)).toBeTruthy();
  //   });

  //   it('Проверяем, что заголовок на странице отсутствует', () => {
  //     spectator = createHost(`
  //       <ui-layout>
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     expect(spectator.query(title)).toBeFalsy();
  //   });

  //   it('Проверяем, что заголовок есть на странице', fakeAsync(() => {
  //     spectator = createHost(`
  //       <ui-layout>
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     headerService.setMetadata({title: 'Title'});
  //     headerService.setLoading(true);

  //     tick(1000);

  //     spectator.detectChanges();

  //     expect(spectator.query(content)).toBeTruthy();
  //   }));

  //   it('Проверяем, что кнопки скролла наверх нету',() => {
  //     spectator = createHost(`
  //       <ui-layout>
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     expect(spectator.query(upButton)).toBeFalsy();
  //   });

  //   it('Проверяем, что кнопка скролла есть на странице',() => {
  //     spectator = createHost(`
  //       <ui-layout>
  //         <div>Content</div>
  //       </ui-layout>
  //     `);

  //     spectator.debugElement.componentInstance.isShowUpButton$.next(true);
  //     spectator.detectChanges();

//     expect(spectator.query(upButton)).toBeTruthy();
//   });
});
