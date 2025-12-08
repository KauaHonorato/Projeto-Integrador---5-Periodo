import { Caminhao } from './caminhao.model';
import { Bairro } from './bairro.model';
import { TipoResiduo } from './tipo-residuo.enum';

export interface Rota {
  id: number;
  caminhao: Caminhao;
  distanciaTotal: number;
  tipoResiduo: TipoResiduo;
  sequenciaBairros: Bairro[];
}