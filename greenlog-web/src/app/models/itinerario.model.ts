import { Rota } from './rota.model';

export enum ItinerarioStatus {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export interface Itinerario extends Rota {
  dataAgendamento: string;
  status: ItinerarioStatus;
}