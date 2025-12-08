import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { BairroService } from '../../../services/bairro.service';
import { RuaService } from '../../../services/rua.service';
import { Bairro, BairroRequest } from '../../../models/bairro.model';
import { forkJoin } from 'rxjs';
interface ConexaoFormItem {
  bairroDestinoId: number | null;
  distanciaKm: number | null;
  isExistente: boolean;
}

@Component({
  selector: 'app-bairro-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, ButtonModule, ToastModule, TooltipModule,
    DropdownModule, InputNumberModule, DividerModule
  ],
  providers: [MessageService],
  templateUrl: './bairro-form.component.html',
  styles: [`
    .conexao-row {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class BairroFormComponent implements OnInit {
  
  bairroId?: number;
  nomeBairro: string = '';
  listaBairros: Bairro[] = [];
  conexoes: ConexaoFormItem[] = [];

  loading = false;
  isEdit = false;

  constructor(
    private bairroService: BairroService,
    private ruaService: RuaService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.bairroService.listar().subscribe({
      next: (dados) => {
        this.listaBairros = dados;
        this.verificarRota();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar lista de bairros' })
    });
  }

  verificarRota() {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.isEdit = true;
      this.bairroId = +idParam;
      this.carregarDadosEdicao(this.bairroId);
    } else {
      this.adicionarConexao();
    }
  }

  carregarDadosEdicao(id: number) {
    this.loading = true;
    forkJoin({
      bairro: this.bairroService.buscarPorId(id),
      todasRuas: this.ruaService.listarTodas()
    }).subscribe({
      next: ({ bairro, todasRuas }) => {
        this.nomeBairro = bairro.nome;
        const ruasDesteBairro = todasRuas.filter(r => r.origemId === id);
        this.conexoes = ruasDesteBairro.map(r => ({
          bairroDestinoId: r.destinoId,
          distanciaKm: r.distanciaKm,
          isExistente: true
        }));
        if (this.conexoes.length === 0) {
          this.adicionarConexao();
        }

        this.loading = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados' });
        this.router.navigate(['/bairros']);
      }
    });
  }

  adicionarConexao() {
    this.conexoes.push({
      bairroDestinoId: null,
      distanciaKm: null,
      isExistente: false
    });
  }

  removerConexao(index: number) {
    if (this.conexoes.length > 1) {
      this.conexoes.splice(index, 1);
    } else {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'É necessário pelo menos uma conexão.' });
    }
  }

  salvar() {
    if (!this.nomeBairro) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'O nome do bairro é obrigatório' });
      return;
    }
    const conexoesValidas = this.conexoes.filter(c => c.bairroDestinoId && c.distanciaKm && c.distanciaKm > 0);

    if (conexoesValidas.length === 0) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Adicione pelo menos uma conexão válida (Destino e Distância > 0).' });
      return;
    }
    if (this.isEdit) {
      const autoConexao = conexoesValidas.find(c => c.bairroDestinoId === this.bairroId);
      if (autoConexao) {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'O bairro não pode se conectar a ele mesmo.' });
        return;
      }
    }

    this.loading = true;
    const request: BairroRequest = {
      nome: this.nomeBairro,
      conexoes: conexoesValidas.map(c => ({
        bairroDestinoId: c.bairroDestinoId!,
        distanciaKm: c.distanciaKm!
      }))
    };

    this.bairroService.salvar(this.bairroId, request).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Bairro e conexões salvos!' });
        setTimeout(() => this.router.navigate(['/bairros']), 1000);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Erro ao salvar';
        this.msg.add({ severity: 'error', summary: 'Erro', detail: msg });
      }
    });
  }
}