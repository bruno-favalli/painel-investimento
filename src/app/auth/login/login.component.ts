import {Router} from "@angular/router";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário válido! Enviando para o serviço...', this.loginForm.value);

      
      //    Passa os dados do formulário (email e senha)
      this.authService.login(this.loginForm.value)
        .subscribe({
          // chamado quando a API retorna sucesso
          next: (response) => {
            console.log('LOGIN BEM-SUCEDIDO!', response);
            localStorage.setItem('caixa-invest-token', response.token);
            localStorage.setItem('caixa-invest-clientId', response.clientId.toString());

            this.router.navigate(['/dashboard']);
            
          },
          
          // chamado se a API retornar um erro
          error: (err) => {
            console.error('ERRO NO LOGIN:', err);
           
          }
        });

    } else {
      console.log('Formulário inválido. Corrija os campos.');
     
      this.loginForm.markAllAsTouched();
    }

}
}