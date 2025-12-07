import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PontoColetaService } from '../../../services/ponto-coleta.service';
import { BairroService } from '../../../services/bairro.service';
import { PontoColeta } from '../../../models/ponto-coleta.model';
import { TipoResiduo } from '../../../models/tipo-residuo.enum';
import { Bairro } from '../../../models/bairro.model';

@Component({
  selector: 'app-ponto-coleta-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, MultiSelectModule, ButtonModule, ToastModule, TooltipModule, DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './ponto-coleta-form.component.html'
})
export class PontoColetaFormComponent implements OnInit {
  
  pontoColeta: PontoColeta = {
    nome: '',
    endereco: '',
    responsavel: '',
    cpfResponsavel: '',
    contato: '',
    tiposResiduos: []
  };

  bairros: Bairro[] = [];
  tiposResiduoOptions = Object.values(TipoResiduo).map(t => ({ label: t, value: t }));
  
  loading = false;
  isEdit = false;

  constructor(
    private service: PontoColetaService,
    private bairroService: BairroService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.bairroService.listar().subscribe({
      next: (lista: Bairro[]) => {
        this.bairros = lista;
        this.verificarRota();
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar bairros' });
      }
    });
  }

  verificarRota() {
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (id) {
          this.isEdit = true;
          return this.service.buscarPorId(+id);
        }
        return of(null);
      })
    ).subscribe({
      next: (ponto: any) => {
        if (ponto) {
          this.pontoColeta = ponto;
          if (ponto.bairroId) {
             const bairroEncontrado = this.bairros.find(b => b.id === ponto.bairroId);
             if (bairroEncontrado) {
                 this.pontoColeta.bairro = bairroEncontrado;
             }
          }
        }
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Ponto de coleta não encontrado' });
        this.router.navigate(['/pontos-coleta']);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/pontos-coleta']);
  }

  salvar() {
    if (!this.pontoColeta.nome || !this.pontoColeta.bairro || !this.pontoColeta.tiposResiduos || this.pontoColeta.tiposResiduos.length === 0) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios' });
      return;
    }

    this.loading = true;
    const payload = {
        ...this.pontoColeta,
        bairroId: this.pontoColeta.bairro?.id 
    };
    const request$ = this.isEdit && this.pontoColeta.id 
        ? this.service.atualizar(this.pontoColeta.id, payload)
        : this.service.criar(payload);

    request$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Ponto de coleta salvo com sucesso!' });
        setTimeout(() => this.router.navigate(['/pontos-coleta']), 1000);
      },
      error: (err: any) => {
        const detail = err.error?.message || 'Erro ao salvar o ponto de coleta';
        this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
        this.loading = false;
      }
    });
  }
}