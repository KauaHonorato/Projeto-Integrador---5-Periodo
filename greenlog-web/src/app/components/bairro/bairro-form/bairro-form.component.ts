import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BairroService } from '../../../services/bairro.service';
import { Bairro } from '../../../models/bairro.model';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-bairro-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, ButtonModule, ToastModule, TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './bairro-form.component.html'
})
export class BairroFormComponent implements OnInit {
  bairro: Bairro = { id: 0, nome: '' };
  loading = false;
  isEdit = false;

  constructor(
    private service: BairroService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (id) {
          this.isEdit = true;
          return this.service.buscarPorId(+id);
        }
        return of(this.bairro);
      })
    ).subscribe({
      next: (bairro: Bairro) => {
        if (bairro) {
          this.bairro = bairro;
        }
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Bairro não encontrado' });
        this.router.navigate(['/bairros']);
      }
    });
  }

  salvar() {
    if (!this.bairro.nome) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'O campo Nome é obrigatório' });
      return;
    }

    this.loading = true;
    this.service.salvar(this.bairro).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Bairro salvo!' });
        setTimeout(() => this.router.navigate(['/bairros']), 1000);
      },
      error: (err: any) => {
        const detail = err.error?.message || 'Erro ao salvar o bairro';
        this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
        this.loading = false;
      }
    });
  }
}