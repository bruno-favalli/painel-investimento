import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss'
})
export class ProfileSelectionComponent {

  constructor(private router: Router) {}

  // ✅ Função para selecionar perfil e redirecionar
  selectProfile(profile: string): void {
    // Mapear perfil para ID correspondente
    const profileIds: { [key: string]: string } = {
      'Conservador': '3',
      'Moderado': '1',
      'Agressivo': '2'
    };

    // Salvar ID do cliente no localStorage
    const clientId = profileIds[profile];
    localStorage.setItem('caixa-invest-clientId', clientId);

    // Redirecionar para o dashboard
    this.router.navigate(['/dashboard']);
  }
}
