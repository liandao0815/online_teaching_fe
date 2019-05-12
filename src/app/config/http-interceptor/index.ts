import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { AuthInterceptor } from './auth-interceptor';
import { RequestInterceptor } from './request-interceptor';
import { ResponseInterceptor } from './response-interceptor';

export const httpInterceptorProviders: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }
];
