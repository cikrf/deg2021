// TODO: Нужно ли? Лучше проверять через e2e

// import { PipesModule } from '@utils/pipes/pipes.module';
// import { fakeAsync } from '@angular/core/testing';
// import { ErrorComponent } from './error.component';
// import { UrlSegment } from '@angular/router';
// import { cold } from 'jest-marbles';
// import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
// import { MockPipesModule } from '../../../../../.test/mocks/mock-pipes/mock-pipes.module';
// import { LegacyUiKitModule } from '../../legacy-ui-kit/legacy-ui-kit.module';

// describe('ErrorComponent', () => {
//   let spectator: SpectatorRouting<ErrorComponent>;
//   const createComponent = createRoutingFactory({
//     imports: [
//       LegacyUiKitModule,
//       MockPipesModule,
//       PipesModule,
//     ],
//     component: ErrorComponent,
//     routes: [
//       {
//         path: ':section',
//         component: ErrorComponent,
//       },
//     ],
//   });
//   beforeEach(() => spectator = createComponent());

//   it('should create the app', () => {
//     const app = spectator.component;
//     expect(app).toBeTruthy();
//   });

//   it('navigates to 404 error', async () => {
//     // wait for promises to resolve...
//     await spectator.fixture.whenStable();

//     spectator.triggerNavigation({params: {section: 'NOT_FOUND'}, queryParams: {code: '404'}});

//     const expectedTitle = cold('a', {a: 'ERRORS.SECTIONS.NOT_FOUND.404.TITLE'});
//     const expectedText = cold('a', {a: 'ERRORS.SECTIONS.NOT_FOUND.404.TEXT'});
//     spectator.fixture.whenStable().then(() => {
//       expect(spectator.component.title$).toBeObservable(expectedTitle);
//       expect(spectator.component.text$).toBeObservable(expectedText);
//     });
//   });

//   it(`navigates without section and code`, fakeAsync(() => {
//     spectator.triggerNavigation({url: [new UrlSegment('/', {})]});
//     const expectedTitle = cold('a', {a: 'ERRORS.SECTIONS.404.TITLE'});
//     const expectedText = cold('a', {a: 'ERRORS.SECTIONS.404.TEXT'});
//     spectator.fixture.whenStable().then(() => {
//       expect(spectator.component.title$).toBeObservable(expectedTitle);
//       expect(spectator.component.text$).toBeObservable(expectedText);
//     });
//   }));

//   it(`navigates with return`, fakeAsync(() => {
//     spectator.triggerNavigation({queryParams: {return: true}});
//     const expectedReturn = cold('a', {a: true});
//     spectator.fixture.whenStable().then(() => {
//       expect(spectator.component.returnUrl$).toBeObservable(expectedReturn);
//     });
//   }));


// });
