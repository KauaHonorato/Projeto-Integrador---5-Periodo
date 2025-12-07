import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BairroService } from '../../../services/bairro.service';
import { Bairro } from '../../../models/bairro.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-bairro-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './bairro-list.component.html'
})
export class BairroListComponent implements OnInit {
  bairros: Bairro[] = [];
  carregando = false;

  constructor(
    private service: BairroService,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: (lista: Bairro[]) => {
        this.bairros = lista;
        this.carregando = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar bairros' });
        this.carregando = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/bairros/novo']);
  }

  editar(bairro: Bairro): void {
    this.router.navigate(['/bairros/editar', bairro.id]);
  }

  confirmarExclusao(bairro: Bairro): void {
    this.confirm.confirm({
      message: `Excluir o bairro "${bairro.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.service.excluir(bairro.id!).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Bairro excluído!' });
            this.carregar();
          },
          error: (err: any) => {
            const detail = err.error?.message || 'Erro ao excluir o bairro';
            this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
          }
        });
      }
    });
  }
}