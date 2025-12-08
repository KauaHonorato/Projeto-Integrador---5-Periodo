import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bairro } from '../models/bairro.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BairroService {
  private readonly apiUrl = `${environment.apiUrl}/bairros`;
  
  loading = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Bairro[]> {
    return this.http.get<Bairro[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Bairro> {
    return this.http.get<Bairro>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  salvar(bairro: Bairro): Observable<Bairro> {
    if (bairro.id) {
      return this.http.put<Bairro>(`${this.apiUrl}/${bairro.id}`, bairro, { headers: this.getHeaders() });
    }
    return this.http.post<Bairro>(this.apiUrl, bairro, { headers: this.getHeaders() });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}