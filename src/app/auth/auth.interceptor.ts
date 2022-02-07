import {Injectable, InjectionToken} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {API_URL} from '../app.settings';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    const isApiUrl = request.url.startsWith(API_URL);
    if (accessToken && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${accessToken}`}
      });
    }

    return next.handle(request);
  }
}
