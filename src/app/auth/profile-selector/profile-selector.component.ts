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

  // ✅ Função CORRIGIDA para selecionar perfil
  selectProfile(profile: string): void {
    console.log('Perfil selecionado:', profile); // ✅ Debug

    // ✅ Mapear perfil para ID correspondente
    let clientId: string;
    
    switch(profile) {
      case 'Conservador':
        clientId = '3';
        break;
      case 'Moderado':
        clientId = '1';
        break;
      case 'Agressivo':
        clientId = '2';
        break;
      default:
        clientId = '1'; // Padrão = Moderado
    }

    console.log('Client ID:', clientId); // ✅ Debug

    // Salvar ID do cliente no localStorage
    localStorage.setItem('caixa-invest-clientId', clientId);

    // ✅ Forçar recarregamento da página para buscar novo perfil
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    });
  }
}
