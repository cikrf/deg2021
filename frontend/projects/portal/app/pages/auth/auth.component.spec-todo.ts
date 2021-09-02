// TODO: Сделано через e2e, этот наверное можно выпилить

// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AuthComponent } from './auth.component';
// import { APP_BASE_HREF, Location } from '@angular/common';
// import { UniversalTokenService } from '../../services/universal-token.service';
// import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
// import { AuthService } from './auth.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { MockPipesModule } from '../../../../../.test/mocks/mock-pipes/mock-pipes.module';
// import { ErrorSection } from '../error/error-section.enum';
// import { AppRoutingEnum } from '../../app-routing.enum';
// import { LegacyUiKitModule } from '../../legacy-ui-kit/legacy-ui-kit.module';
// import { WindowService } from '@modules/browser-services/window.service';

// let router: Router;
// let location: Location;
// let windowService: WindowService;
// let authService: AuthService;
// let uts: UniversalTokenService;

// const activatedRouteStub = {
//   queryParams: new BehaviorSubject<ActivatedRouteStubInterface>({
//     error: '',
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     error_description: '',
//     returnUrl: '',
//     code: '',
//     state: '',
//   }),
// };


// @Component({
//   template: '',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// class EmptyComponent {}

// describe('Auth Module', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule.withRoutes([
//           {
//             path: 'error',
//             component: EmptyComponent,
//           },
//           {
//             path: 'error/:section',
//             component: EmptyComponent,
//           },
//         ]),
//         HttpClientTestingModule,
//         MockPipesModule,
//         LegacyUiKitModule,
//       ],
//       declarations: [
//         EmptyComponent,
//         AuthComponent,
//       ],
//       providers: [
//         {
//           provide: APP_BASE_HREF,
//           useValue: '/',
//         },
//         {
//           provide: UniversalTokenService,
//           useValue: {
//             token$: new Subject(),
//             updateToken: jest.fn(),
//           },
//         },
//         {
//           provide: AuthService,
//           useValue: {
//             getAuthUrl: (): Observable<string> => of('/auth_url'),
//             auth: jest.fn().mockReturnValue(of('TOKEN')),
//             logout: (): void => {},
//           },
//         },
//         {
//           provide: ActivatedRoute,
//           useValue: activatedRouteStub,
//         },
//         {
//           provide: WindowService,
//           useValue: {
//             goto: jest.fn(),
//             href: '/',
//             path: '/',
//           },
//         },
//       ],
//     }).compileComponents();

//     router = TestBed.inject(Router);
//     location = TestBed.inject(Location);
//     windowService = TestBed.inject(WindowService);
//     authService = TestBed.inject(AuthService);
//     uts = TestBed.inject(UniversalTokenService);

//   });

//   // запуск компонента
//   it('should create', ((done) => {
//     const fixture = TestBed.createComponent(AuthComponent);
//     const component = fixture.componentInstance;
//     expect(component).toBeTruthy();
//     done();
//   }));

//   // пришли на компонент с ошибкой из есиа
//   it('navigates to error', ((done) => {

//     const queryParams = {
//       error: 'my err',
//       // eslint-disable-next-line @typescript-eslint/naming-convention
//       error_description: 'my err desc',
//     };

//     activatedRouteStub.queryParams.next(queryParams);
//     const fixture = TestBed.createComponent(AuthComponent);

//     fixture.whenStable().then(() => {
//       expect(router.url).toBe(`/${AppRoutingEnum.Error}/${ErrorSection.Esia}?code=my%20err`);
//       done();
//     });

//   }));

//   // пришли с параметрами, но с бэка пришла ошибка: редиректнули на ошибку
//   // то же самое что и один из тестов выше, но плюс параметры code, state, returnUrl
//   it('params with error', ((done) => {

//     const queryParams = {
//       error: 'my err',
//       // eslint-disable-next-line @typescript-eslint/naming-convention
//       error_description: 'my err desc',
//       code: 'CODE',
//       state: 'STATE',
//       returnUrl: 'returnUrl',
//     };

//     activatedRouteStub.queryParams.next(queryParams);
//     const fixture = TestBed.createComponent(AuthComponent);
//     fixture.autoDetectChanges();

//     fixture.whenStable().then(() => {
//       expect(router.url).toBe(`/${AppRoutingEnum.Error}/${ErrorSection.Esia}?code=my%20err`);
//       done();
//     });

//   }));

//   // пришли без параметров: значит получили редирект урл и ушли туда
//   // (либо остались на этом же урле либо покинули сайт, уйдя на госуслуги)
//   it('no params', ((done) => {

//     activatedRouteStub.queryParams.next({});
//     const fixture = TestBed.createComponent(AuthComponent);
//     fixture.autoDetectChanges();

//     fixture.whenStable().then(() => {
//       expect(windowService.goto).toBeCalledTimes(1);
//       expect(windowService.goto).toBeCalledWith('/auth_url');
//       done();
//     });
//   }));

//   // пришли без одного из параметров - также должны уйти на урлку авторизации
//   it('no code or state', ((done) => {

//     const queryParams = {
//       code: 'CODE',
//       returnUrl: 'returnUrl',
//     };

//     activatedRouteStub.queryParams.next(queryParams);
//     const fixture = TestBed.createComponent(AuthComponent);
//     fixture.autoDetectChanges();

//     fixture.whenStable().then(() => {
//       expect(windowService.goto).toBeCalledTimes(1);
//       expect(windowService.goto).toBeCalledWith('/auth_url');
//       done();
//     });

//   }));

//   // пришли с параметрами: значит получили токен с бэка, прописали в токен-сервис, редиректнули на урл есиа-инфо
//   it('navigates to content', ((done) => {

//     const queryParams = {
//       code: 'CODE',
//       state: 'STATE',
//       returnUrl: 'returnUrl',
//     };

//     activatedRouteStub.queryParams.next(queryParams);
//     const fixture = TestBed.createComponent(AuthComponent);
//     fixture.autoDetectChanges();

//     fixture.whenStable().then(() => {
//       expect(router.url).toBe('/');
//       expect(authService.auth).toBeCalledTimes(1);
//       expect(authService.auth).toBeCalledWith(queryParams.code, queryParams.state, `/${queryParams.returnUrl}`);
//       expect(uts.updateToken).toBeCalledTimes(1);
//       expect(uts.updateToken).toBeCalledWith('TOKEN');
//       done();
//     });

//   }));

// });

// interface ActivatedRouteStubInterface {
//   error?: string;
//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   error_description?: string;
//   returnUrl?: string;
//   code?: string;
//   state?: string;
// }
