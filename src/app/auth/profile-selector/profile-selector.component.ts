import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; 
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-profile-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, LoginComponent],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss'
})
export class ProfileSelectorComponent {

  constructor(private router: Router) { }

  // 1. DEFINIÇÃO DOS PERfIS DE TESTE
  perfisDeTeste = [
    { id: '123', nome: 'Moderado (Padrão)', risco: 'Moderado' },
    { id: '101', nome: 'Conservador', risco: 'Baixo' },
    { id: '202', nome: 'Agressivo', risco: 'Alto' },
  ];

  // 2. MÉTODO PARA SELECIONAR E NAVEGAR
  selecionarPerfil(clientId: string): void {
    // Salva o ID no localStorage
    localStorage.setItem('caixa-invest-clientId', clientId);
    // Navega para o dashboard
    this.router.navigate(['/dashboard']);
  }
}