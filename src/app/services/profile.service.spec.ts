import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileResponse } from '../models/profile.model';
import { importProvidersFrom } from '@angular/core';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        importProvidersFrom(HttpClientTestingModule) // Necessário para simular o HTTP
      ]
    });
    service = TestBed.inject(ProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve the client profile via GET', () => {
    const mockProfile: ProfileResponse = { 
      clientId: 123,
      nomeCliente: 'João Silva', 
      perfil: 'Moderado', 
      descricao: 'Teste', 
      pontuacao: 65 
    };
    const clientId = 123;
    const expectedUrl = `https://api-caixa.exemplo/perfil-risco/${clientId}`;

    service.getProfile(clientId).subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockProfile); // Simula a resposta
  });
});