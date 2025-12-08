import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PontoColeta } from '../models/ponto-coleta.model';

@Injectable({
  providedIn: 'root'
})
export class PontoColetaService {

  private readonly API = 'http://localhost:8080/api/pontos-coleta';

  constructor(private http: HttpClient) { }

  listar(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(this.API);
  }

  buscarPorId(id: number): Observable<PontoColeta> {
    return this.http.get<PontoColeta>(`${this.API}/${id}`);
  }
  criar(ponto: any): Observable<PontoColeta> {
    return this.http.post<PontoColeta>(this.API, ponto);
  }

  atualizar(id: number, ponto: any): Observable<PontoColeta> {
    return this.http.put<PontoColeta>(`${this.API}/${id}`, ponto);
  }
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}