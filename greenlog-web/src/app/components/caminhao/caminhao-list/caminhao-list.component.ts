import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { CaminhaoService } from '../../../services/caminhao.service';
import { Caminhao } from '../../../models/caminhao.model';

@Component({
  selector: 'app-caminhao-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './caminhao-list.component.html',
  styleUrls: ['./caminhao-list.component.css']
})
export class CaminhaoListComponent implements OnInit {

  caminhoes: Caminhao[] = [];
  carregando = false;

  constructor(
    private service: CaminhaoService,
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
      next: (lista) => {
        this.caminhoes = lista;
        this.carregando = false;
      },
      error: (err) => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar' });
        this.carregando = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/caminhoes/novo']);
  }

  confirmarExclusao(c: Caminhao): void {
    this.confirm.confirm({
      message: `Excluir caminhão ${c.placa}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      accept: () => {
        this.service.excluir(c.id!).subscribe(() => {
          this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Excluído' });
          this.carregar();
        });
      }
    });
  }
}