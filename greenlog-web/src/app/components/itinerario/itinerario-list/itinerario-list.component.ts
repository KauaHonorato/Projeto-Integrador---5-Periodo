import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; 
import { ItinerarioService } from '../../../services/itinerario.service';
import { Itinerario, ItinerarioStatus } from '../../../models/itinerario.model';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Bairro } from '../../../models/bairro.model';

type Severity = 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast';

@Component({
  selector: 'app-itinerario-list',
  standalone: true,
  imports: [
    CommonModule, TableModule, ToastModule, TagModule, TooltipModule
  ],
  providers: [MessageService, DatePipe, DecimalPipe], 
  templateUrl: './itinerario-list.component.html'
})
export class ItinerarioListComponent implements OnInit {
  itinerarios: Itinerario[] = [];
  carregando = false;

  constructor(
    private service: ItinerarioService,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: (lista: Itinerario[]) => {
        this.itinerarios = lista;
        this.carregando = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar itinerários' });
        this.carregando = false;
      }
    });
  }

  getSeverity(status: ItinerarioStatus): Severity {
    switch (status) {
      case ItinerarioStatus.AGENDADO: return 'info';
      case ItinerarioStatus.EM_ANDAMENTO: return 'warning';
      case ItinerarioStatus.CONCLUIDO: return 'success';
      case ItinerarioStatus.CANCELADO: return 'danger';
      default: return 'secondary';
    }
  }

  formatarBairros(itinerario: Itinerario): string {
    if (!itinerario.sequenciaBairros || itinerario.sequenciaBairros.length === 0) return 'N/A';
    return itinerario.sequenciaBairros.map((b: Bairro) => b.nome).join(' → ');
  }
}