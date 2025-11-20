import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileSelectionComponent } from '../profile-selector/profile-selector.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProfileSelectionComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // ✅ Formulário de login
  loginForm!: FormGroup;
  
  // ✅ Controle de visibilidade da senha
  hidePassword: boolean = true;
  
  // ✅ Estado de loading
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar o formulário com validações
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ✅ Função de submit do formulário
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      // Pegar os valores do formulário
      const { email, password } = this.loginForm.value;

      // Simular uma chamada à API (2 segundos)
      setTimeout(() => {
        // Aqui você faria a chamada real à sua API
        console.log('Login attempt:', { email, password });

        // Simulando login bem-sucedido
        // Salvar ID do cliente no localStorage (exemplo)
        localStorage.setItem('caixa-invest-clientId', '1'); // ID fictício
        
        // Redirecionar para o dashboard
        this.router.navigate(['/dashboard']);
        
        this.isLoading = false;
      }, 2000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // ✅ Função para alternar visibilidade da senha
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
