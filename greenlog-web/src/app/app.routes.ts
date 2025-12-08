import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CaminhaoListComponent } from './components/caminhao/caminhao-list/caminhao-list.component';
import { CaminhaoFormComponent } from './components/caminhao/caminhao-form/caminhao-form.component';
import { RotaCalcComponent } from './components/rota/rota-calc/rota-calc.component';
import { BairroListComponent } from './components/bairro/bairro-list/bairro-list.component'; 
import { BairroFormComponent } from './components/bairro/bairro-form/bairro-form.component'; 
import { PontoColetaListComponent } from './components/ponto-coleta/ponto-coleta-list/ponto-coleta-list.component'; 
import { PontoColetaFormComponent } from './components/ponto-coleta/ponto-coleta-form/ponto-coleta-form.component'; 
import { ItinerarioListComponent } from './components/itinerario/itinerario-list/itinerario-list.component'; 
import { authGuard } from './commons/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  { 
    path: 'caminhoes', 
    component: CaminhaoListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'caminhoes/novo', 
    component: CaminhaoFormComponent,
    canActivate: [authGuard]
  },
  
  { 
    path: 'rotas', 
    component: RotaCalcComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'itinerarios', 
    component: ItinerarioListComponent,
    canActivate: [authGuard]
  },
  
  { 
    path: 'bairros', 
    component: BairroListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bairros/novo', 
    component: BairroFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bairros/editar/:id', 
    component: BairroFormComponent,
    canActivate: [authGuard]
  },

  { 
    path: 'pontos-coleta', 
    component: PontoColetaListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'pontos-coleta/novo', 
    component: PontoColetaFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'pontos-coleta/editar/:id', 
    component: PontoColetaFormComponent,
    canActivate: [authGuard]
  },
];