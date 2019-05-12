import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { ERROR_CODE } from 'config/http-config';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService, private notifiaction: NzNotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response && event.body.code === ERROR_CODE) {
          this.message.error(event.body.message);
        }
      }),
      catchError(this.handleErrorResponse)
    );
  }

  private handleErrorResponse = (error: HttpErrorResponse): Observable<HttpErrorResponse> => {
    switch (error.status) {
      case 404:
        this.notifiaction.error(error.name, '找不到您要的资源');
        break;
      case 500:
        this.notifiaction.error(error.name, '糟糕，服务器错误了');
        break;
    }

    return throwError(error);
  }
}
