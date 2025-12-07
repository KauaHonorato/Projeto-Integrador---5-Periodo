import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ToastModule, 
    CardModule, 
    ButtonModule, 
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginRequest: LoginRequest = {
    login: '',
    senha: ''
  };

  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private messageService: MessageService
  ) {}

  fazerLogin() {
 
    if (!this.loginRequest.login || !this.loginRequest.senha) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Preencha todos os campos!'});
      return;
    }

    this.loading = true;

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Login realizado!'});
        setTimeout(() => {
            this.router.navigate(['/caminhoes']);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.messageService.add({severity:'error', summary:'Erro', detail:'Usuário ou senha inválidos'});
      }
    });
  }
}