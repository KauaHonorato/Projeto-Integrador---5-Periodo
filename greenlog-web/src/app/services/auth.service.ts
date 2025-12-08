import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
export interface LoginRequest {
  login: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.AUTH_URL}/login`, credentials, { responseType: 'text' }).pipe(
      tap(() => {
        const basicToken = 'Basic ' + btoa(credentials.login + ':' + credentials.senha);
        
        localStorage.setItem('auth_token', basicToken);
        localStorage.setItem('user_login', credentials.login);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_login');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}