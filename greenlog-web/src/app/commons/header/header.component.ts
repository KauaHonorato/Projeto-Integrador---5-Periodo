import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Gestão',
        icon: 'pi pi-cog',
        items: [
          { label: 'Caminhões', icon: 'pi pi-truck', routerLink: '/caminhoes' },

          { label: 'Pontos de Coleta', icon: 'pi pi-map-marker', routerLink: '/pontos-coleta' },

          { label: 'Rotas', icon: 'pi pi-directions', routerLink: '/rotas' },

          { label: 'Itinerários', icon: 'pi pi-calendar', routerLink: '/itinerarios' },

          { label: 'Bairros', icon: 'pi pi-map', routerLink: '/bairros' }
        ]
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout();
  }
}