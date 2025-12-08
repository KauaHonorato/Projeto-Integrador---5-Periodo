import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { CaminhaoService } from '../../../services/caminhao.service';
import { Caminhao } from '../../../models/caminhao.model';
import { TipoResiduo } from '../../../models/tipo-residuo.enum';

@Component({
  selector: 'app-caminhao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, InputNumberModule, MultiSelectModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './caminhao-form.component.html',
  styleUrls: ['./caminhao-form.component.css']
})
export class CaminhaoFormComponent {
  
  caminhao: Caminhao = {
    placa: '',
    modelo: '',
    motorista: '',
    capacidadeCarga: 0,
    tiposResiduos: []
  };

  tiposResiduoOptions = Object.values(TipoResiduo).map(t => ({ label: t, value: t }));
  loading = false;

  constructor(
    private service: CaminhaoService,
    private router: Router,
    private msg: MessageService
  ) {}

  salvar() {
    this.loading = true;
    this.service.salvar(this.caminhao).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Salvo!' });
        setTimeout(() => this.router.navigate(['/caminhoes']), 1000);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar' });
        this.loading = false;
      }
    });
  }
}