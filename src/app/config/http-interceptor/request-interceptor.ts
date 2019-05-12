import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const apiUrlPrefix = environment.apiUrlPrefix;
    const uid = window.localStorage.getItem('uid') || '0';

    if (!req.url.startsWith('http')) {
      const newReq = req.clone({
        url: apiUrlPrefix + req.url,
        setParams: { uid }
      });

      return next.handle(newReq);
    }

    return next.handle(req);
  }
}
