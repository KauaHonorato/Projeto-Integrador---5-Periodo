import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Caminhao } from '../models/caminhao.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private readonly apiUrl = `${environment.apiUrl}/caminhoes`;
  
  loading = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  salvar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.apiUrl, caminhao, { headers: this.getHeaders() });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}