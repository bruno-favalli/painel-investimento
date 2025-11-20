import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';




describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController; // Para controlar as chamadas simuladas

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 2. Importe o módulo de teste de HTTP
      providers: [AuthService, importProvidersFrom(HttpClientTestingModule)]
    });
    
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController); // Injeta o controlador
  });

  // Garante que não sobrou nenhuma requisição pendente no final
  afterEach(() => {
    httpTestingController.verify();
  });

  // ----------------------------------------------------
  // TESTES
  // ----------------------------------------------------

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to the correct login API endpoint', () => {
    const mockLoginData = { email: 'test@caixa.com', senha: '123' };
    const expectedUrl = 'https://api-caixa.exemplo.com/autenticacao/login';

    // 1. Chama o método que queremos testar
    service.login(mockLoginData).subscribe();

    // 2. Cria uma expectativa de requisição: POST para a URL esperada
    const req = httpTestingController.expectOne(expectedUrl);
    
    // 3. Verifica se o método HTTP está correto
    expect(req.request.method).toBe('POST');
    
    // 4. Verifica se os dados enviados no corpo da requisição estão corretos
    expect(req.request.body).toEqual(mockLoginData);

    // 5. Simula a resposta da API para completar o Observable e evitar erros
    const mockResponse = { token: 'fake-token', clientId: 1 };
    req.flush(mockResponse); 
  });
});