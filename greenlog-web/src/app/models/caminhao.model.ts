import { TipoResiduo } from './tipo-residuo.enum';

export interface Caminhao {
  id?: number;
  placa: string;
  modelo: string;
  motorista: string;
  capacidadeCarga: number;
  tiposResiduos: TipoResiduo[];
}