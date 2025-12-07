import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RotaService } from '../../../services/rota.service';
import { CaminhaoService } from '../../../services/caminhao.service';
import { PontoColetaService } from '../../../services/ponto-coleta.service';
import { Rota } from '../../../models/rota.model';
import { Caminhao } from '../../../models/caminhao.model';
import { PontoColeta } from '../../../models/ponto-coleta.model';
import { TipoResiduo } from '../../../models/tipo-residuo.enum';

@Component({
  selector: 'app-rota-calc',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    DropdownModule, ButtonModule, CardModule, TimelineModule, ToastModule, PanelModule, TagModule, DividerModule
  ],
  providers: [MessageService],
  templateUrl: './rota-calc.component.html',
  styleUrls: ['./rota-calc.component.css']
})
export class RotaCalcComponent implements OnInit {
  pontosColeta: PontoColeta[] = [];
  caminhoes: Caminhao[] = [];
  tiposResiduoOptions = Object.values(TipoResiduo).map(t => ({ label: t, value: t }));
  caminhoesFiltrados: Caminhao[] = [];
  form = {
    origem: null as PontoColeta | null,
    destino: null as PontoColeta | null,
    tipoResiduo: null as TipoResiduo | null,
    caminhao: null as Caminhao | null
  };
  rotaCalculada: Rota | null = null;
  carregando = false;

  constructor(
    private rotaService: RotaService,
    private caminhaoService: CaminhaoService,
    private pontoService: PontoColetaService,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.pontoService.listar().subscribe({
      next: (pontos: PontoColeta[]) => this.pontosColeta = pontos,
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pontos de coleta' })
    });
    this.caminhaoService.listar().subscribe({
      next: (caminhoes) => this.caminhoes = caminhoes,
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar caminhões' })
    });
  }
  aoSelecionarResiduo() {
    this.form.caminhao = null;
    
    if (this.form.tipoResiduo) {
      const tipoSelecionado = this.form.tipoResiduo;
      this.caminhoesFiltrados = this.caminhoes.filter(c => 
        c.tiposResiduos.includes(tipoSelecionado)
      );
    } else {
      this.caminhoesFiltrados = [];
    }
  }

  calcularRota() {
    if (!this.validar()) return;

    this.carregando = true;
    this.rotaCalculada = null;

    this.rotaService.calcular(
      this.form.caminhao!.id!,
      this.form.origem!.id!,
      this.form.destino!.id!,
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

  validar(): boolean {
    if (!this.form.origem || !this.form.destino) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione Origem e Destino' });
      return false;
    }
    if (this.form.origem.id === this.form.destino.id) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'A origem e o destino devem ser diferentes' });
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