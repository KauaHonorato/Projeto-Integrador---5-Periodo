import { Bairro } from './bairro.model';
import { TipoResiduo } from './tipo-residuo.enum';

export interface PontoColeta {
  id?: number;
  nome: string;
  endereco?: string; 
  responsavel?: string;
  cpfResponsavel?: string;
  contato?: string;       
  bairroNome?: string; 
  bairroId?: number;
  bairro?: Bairro; 
  tiposResiduos: TipoResiduo[];
}