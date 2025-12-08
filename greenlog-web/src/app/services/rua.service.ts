import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RuaResponse } from '../models/rua.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RuaService {
  private readonly apiUrl = `${environment.apiUrl}/ruas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }
  listarTodas(): Observable<RuaResponse[]> {
    return this.http.get<RuaResponse[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}