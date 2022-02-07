import {Injectable, OnDestroy} from '@angular/core';
import {API_URL} from '../app.settings';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApplicationUser} from '../models/application-user.model';
import {Router} from '@angular/router';
import {finalize, map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const STORAGE_KEYS = {
  accessToken: 'access_token',
  accessTokenExpiration: 'access_token_expiration',
  loginEvent: 'login_event',
  logoutEvent: 'logout_event'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  // tslint:disable-next-line:variable-name
  private _user = new BehaviorSubject<ApplicationUser>(null);
  public user$: Observable<ApplicationUser> = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === STORAGE_KEYS.loginEvent) {
        location.reload();
      }
      if (event.key === STORAGE_KEYS.logoutEvent) {
        this._user.next(null);
      }
    }
  }

  constructor(private router: Router, private http: HttpClient) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + '/auth/login', {
      email,
      password
    }, httpOptions).pipe(
      map((result: any) => {
        localStorage.setItem(STORAGE_KEYS.accessToken, result.token);
        localStorage.setItem(STORAGE_KEYS.accessTokenExpiration, result.expiration);
        localStorage.setItem(STORAGE_KEYS.loginEvent, 'login' + Math.random());
        this._user.next(result.user);
        return {status: 'Success'};
    })
    );
  }

  register(user: ApplicationUser): Observable<any> {
    return this.http.post(API_URL + '/auth/register', {
      ...user
    }, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(API_URL + '/auth/logout', {}, httpOptions).pipe(
      finalize(() => {
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        localStorage.removeItem(STORAGE_KEYS.accessTokenExpiration);
        localStorage.setItem(STORAGE_KEYS.logoutEvent, 'logout' + Math.random());
        this._user.next(null);
        this.router.navigate(['/']);
      })
    );
  }

  getAccessToken(): string {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(map((user: ApplicationUser) => {
      return user !== null && user.roles.find(r => r === 'Admin') !== undefined;
    }));
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user: ApplicationUser) => {
      return user !== null;
    }));
  }
}
