import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rota } from '../models/rota.model';
import { TipoResiduo } from '../models/tipo-residuo.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RotaService {
  private readonly apiUrl = `${environment.apiUrl}/rotas`;
  
  loading = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Rota[]> {
    return this.http.get<Rota[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  calcular(caminhaoId: number, origemId: number, destinoId: number, tipoResiduo: TipoResiduo): Observable<Rota> {
    const body = {
      caminhaoId: caminhaoId,
      tipoResiduo: tipoResiduo,
      bairroIds: [origemId, destinoId]
    };
    return this.http.post<Rota>(`${this.apiUrl}/calcular`, body, { headers: this.getHeaders() });
  }
}