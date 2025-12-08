export interface Bairro {
  id?: number;
  nome: string;
  emUso?: boolean;
}

export interface ConexaoRequest {
  bairroDestinoId: number;
  distanciaKm: number;
}

export interface BairroRequest {
  nome: string;
  conexoes: ConexaoRequest[];
}
