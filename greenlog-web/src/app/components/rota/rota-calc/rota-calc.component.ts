import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar'; 

// Services e Models
import { RotaService } from '../../../services/rota.service';
import { CaminhaoService } from '../../../services/caminhao.service';
import { PontoColetaService } from '../../../services/ponto-coleta.service';
import { ItinerarioService } from '../../../services/itinerario.service';
import { Rota } from '../../../models/rota.model';
import { Caminhao } from '../../../models/caminhao.model';
import { PontoColeta } from '../../../models/ponto-coleta.model';
import { TipoResiduo } from '../../../models/tipo-residuo.enum';

// DTO para a requisição de agendamento
interface ItinerarioAgendamentoRequest {
  data: string;
  rotaId: number;
  caminhaoId: number;
}


@Component({
  selector: 'app-rota-calc',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    DropdownModule, ButtonModule, CardModule, TimelineModule, ToastModule, PanelModule, TagModule, DividerModule,
    CalendarModule // Importado corretamente
  ],
  providers: [MessageService],
  templateUrl: './rota-calc.component.html',
  styleUrls: ['./rota-calc.component.css']
})
export class RotaCalcComponent implements OnInit {
  
  allPontosColeta: PontoColeta[] = []; 
  pontosColetaFiltrados: PontoColeta[] = []; 
  caminhoes: Caminhao[] = [];
  caminhoesFiltrados: Caminhao[] = [];

  tiposResiduoOptions = Object.values(TipoResiduo).map(t => ({ label: t, value: t }));

  form = {
    origem: null as PontoColeta | null,
    destino: null as PontoColeta | null,
    tipoResiduo: null as TipoResiduo | null,
    caminhao: null as Caminhao | null,
    dataAgendamento: new Date() as Date | null
  };

  dataMinima = new Date();
  rotaCalculada: Rota | null = null;
  carregando = false;

  constructor(
    private rotaService: RotaService,
    private caminhaoService: CaminhaoService,
    private pontoService: PontoColetaService,
    private itinerarioService: ItinerarioService, // Injeção
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.pontoService.listar().subscribe({
      next: (pontos: PontoColeta[]) => {
        this.allPontosColeta = pontos;
        this.pontosColetaFiltrados = pontos;
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pontos de coleta' })
    });
    this.caminhaoService.listar().subscribe({
      next: (caminhoes) => this.caminhoes = caminhoes,
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar caminhões' })
    });
  }

  aoSelecionarResiduo() {
    this.form.caminhao = null;
    this.form.origem = null;
    this.form.destino = null;
    this.rotaCalculada = null; 
    
    if (this.form.tipoResiduo) {
      const tipoSelecionado = this.form.tipoResiduo;
      
      this.caminhoesFiltrados = this.caminhoes.filter(c => 
        c.tiposResiduos.includes(tipoSelecionado)
      );

      this.pontosColetaFiltrados = this.allPontosColeta.filter(p =>
        p.tiposResiduos.includes(tipoSelecionado)
      );
      
      if (this.pontosColetaFiltrados.length === 0) {
        this.msg.add({ severity: 'info', summary: 'Aviso', detail: 'Nenhum ponto de coleta aceita este resíduo.' });
      }

    } else {
      this.caminhoesFiltrados = [];
      this.pontosColetaFiltrados = this.allPontosColeta; 
    }
  }

  calcularRota() {
    if (!this.validar()) return;

    this.carregando = true;
    this.rotaCalculada = null;

    // CORREÇÃO: Usa o ID do Bairro
    const origemId = this.form.origem!.bairroId;
    const destinoId = this.form.destino!.bairroId;
    
    this.rotaService.calcular(
      this.form.caminhao!.id!,
      origemId!,
      destinoId!,
      this.form.tipoResiduo!
    ).subscribe({
      next: (rota) => {
        this.rotaCalculada = rota;
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Rota calculada!' });
        this.carregando = false;
      },
      error: (err: any) => {
        this.carregando = false;
        const msgErro = err.error?.message || 'Não foi possível calcular a rota (Verifique se há conexão entre os pontos)';
        this.msg.add({ severity: 'error', summary: 'Erro no Cálculo', detail: msgErro });
      }
    });
  }
  
  agendarRota() {
    if (!this.rotaCalculada) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Primeiro calcule uma rota.' });
      return;
    }
    if (!this.form.dataAgendamento) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione uma data para o agendamento.' });
      return;
    }
    
    this.carregando = true;
    
    const dataFormatada = this.form.dataAgendamento.toISOString().split('T')[0];

    const requestBody: ItinerarioAgendamentoRequest = {
      data: dataFormatada,
      rotaId: this.rotaCalculada.id,
      caminhaoId: this.rotaCalculada.caminhao.id! 
    };

    this.itinerarioService.agendar(requestBody).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Itinerário agendado!' });
        this.carregando = false;
        this.rotaCalculada = null; 
      },
      error: (err: any) => {
        this.carregando = false;
        const detail = err.error?.message || 'Erro ao agendar o itinerário (Conflito de agenda?)';
        this.msg.add({ severity: 'error', summary: 'Erro de Agendamento', detail: detail });
      }
    });
  }

  validar(): boolean {
    if (!this.form.origem || !this.form.destino) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione Origem e Destino' });
      return false;
    }
    if (this.form.origem.bairroId === this.form.destino.bairroId) { 
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Os pontos de origem e destino devem estar em bairros diferentes' });
      return false;
    }
    if (!this.form.tipoResiduo) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione o Tipo de Resíduo' });
      return false;
    }
    if (!this.form.caminhao) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um Caminhão' });
      return false;
    }
    return true;
  }
}