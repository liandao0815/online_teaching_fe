import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const authReq = req.clone({ setHeaders: { Authorization: authToken } });

    return next.handle(authReq);
  }

  private getAuthorizationToken(): string {
    return window.localStorage.getItem('token') || '';
  }
}
