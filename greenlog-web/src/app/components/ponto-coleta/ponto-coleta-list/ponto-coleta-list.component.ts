import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PontoColetaService } from '../../../services/ponto-coleta.service';
import { PontoColeta } from '../../../models/ponto-coleta.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-ponto-coleta-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ponto-coleta-list.component.html'
})
export class PontoColetaListComponent implements OnInit {
  pontosColeta: PontoColeta[] = [];
  carregando = false;

  constructor(
    private service: PontoColetaService,
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
      next: (lista: PontoColeta[]) => {
        this.pontosColeta = lista;
        this.carregando = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar pontos de coleta' });
        this.carregando = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/pontos-coleta/novo']);
  }

  editar(ponto: PontoColeta): void {
    this.router.navigate(['/pontos-coleta/editar', ponto.id]);
  }

  confirmarExclusao(ponto: PontoColeta): void {
    this.confirm.confirm({
      message: `Excluir o ponto de coleta "${ponto.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.service.excluir(ponto.id!).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Ponto de coleta excluído!' });
            this.carregar();
          },
          error: (err: any) => {
            const detail = err.error?.message || 'Erro ao excluir o ponto de coleta';
            this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
          }
        });
      }
    });
  }
}