import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  // Mock do AuthService para simular as chamadas
  const authServiceMock = {
    login: (data: any) => of({ token: 'fake-jwt-token', clientId: 123 }),
  };

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Componente Standalone sendo testado
      imports: [LoginComponent, ReactiveFormsModule], 
      
      // Provedores necessários para as dependências do componente
      providers: [
        // Solução para o NullInjectorError do HttpClient
        importProvidersFrom(HttpClientTestingModule),
        // Fornece a instância mockada do AuthService
        { provide: AuthService, useValue: authServiceMock },
        // Fornece um espião (spy) para o Router
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.loginForm.get('email')?.value).toEqual('');
    expect(component.loginForm.get('senha')?.value).toEqual('');
    expect(component.loginForm.invalid).toBeTrue(); // Inicia inválido
  });

  it('should call AuthService.login and navigate on successful submission', () => {
    // Espia o método login para saber quando ele é chamado
    spyOn(authService, 'login').and.returnValue(of({ token: 'test-token', clientId: 123 }));

    // Define valores válidos no formulário
    component.loginForm.get('email')?.setValue('teste@caixa.com');
    component.loginForm.get('senha')?.setValue('123456');

    component.onSubmit(); // Chama o método de submissão

    expect(authService.login).toHaveBeenCalled();
    // Verifica se a navegação ocorreu corretamente
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']); 
  });
  
  it('should NOT navigate if form is invalid', () => {
    routerSpy.navigate.calls.reset();
    spyOn(authService, 'login').and.returnValue(of({ token: 'test-token', clientId: 123 }));
    component.loginForm.get('email')?.setValue('emailinvalido');
    fixture.detectChanges();
    component.onSubmit(); 
    
    expect(authService.login).not.toHaveBeenCalled();
  expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});