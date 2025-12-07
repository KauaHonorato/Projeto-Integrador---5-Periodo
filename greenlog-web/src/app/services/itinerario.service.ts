import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Itinerario } from '../models/itinerario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItinerarioService {
  private readonly apiUrl = `${environment.apiUrl}/itinerarios`;
  
  loading = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Itinerario[]> {
    return this.http.get<Itinerario[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}