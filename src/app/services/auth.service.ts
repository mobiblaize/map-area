import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private router: Router) { }

  login() {
    this._isAuthenticated.next(true);
    return of(true);
  }

  logout() {
    this._isAuthenticated.next(false);
    this.router.navigate(['/auth'], {
      replaceUrl: true,
    });
    return of(false);
  }
}
