import { TestBed } from '@angular/core/testing';
import { InvestmentService } from './investment.service';
// Adicionamos os imports necessários para simulação HTTP e módulos Standalone
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';

// Importamos os modelos para tipagem
import { Product } from '../models/product.model';
import { InvestmentHistory } from '../models/investment-history.model';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'https://api-caixa.exemplo.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      // A SOLUÇÃO GARANTIDA: Carregar o módulo de teste HTTP no Standalone
      providers: [
        InvestmentService,
        importProvidersFrom(HttpClientTestingModule) 
      ]
    });
    
    service = TestBed.inject(InvestmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Garante que todas as requisições foram tratadas
  });

  // ----------------------------------------------------
  // Teste 1: Criação do Serviço
  // ----------------------------------------------------
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ----------------------------------------------------
  // Teste 2: getRecommendedProducts
  // ----------------------------------------------------
  it('should retrieve recommended products for a given profile', () => {
    const mockProducts: Product[] = [
      { id: 1, nome: 'CDB Teste', tipo: 'CDB', rentabilidade: 0.1, risco: 'Baixo' }
    ];
    const profile = 'Agressivo';
    const expectedUrl = `${apiUrl}/produtos-recomendados/${profile}`;

    service.getProdutosRecomendados(profile).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  // ----------------------------------------------------
  // Teste 3: getInvestmentHistory
  // ----------------------------------------------------
  it('should retrieve investment history for a client ID', () => {
    const mockHistory: InvestmentHistory[] = [
      { id: 1, tipo: 'LCA', valor: 5000, rentabilidade: 0.05, data: '2024-01-01' }
    ];
    const clientId = 456;
    const expectedUrl = `${apiUrl}/investimentos/${clientId}`;

    service.getInvestmentHistory(clientId).subscribe(history => {
      expect(history.length).toBe(1);
      expect(history).toEqual(mockHistory);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  // ----------------------------------------------------
  // Teste 4: simulateInvestment
  // ----------------------------------------------------
  it('should send a POST request for investment simulation', () => {
    const mockRequest: SimulationRequest = { 
        valor: 1000, 
        prazoMeses: 6, 
        tipo: 'Tesouro Direto' 
    };
    const mockResponse: SimulationResponse = { 
        valorFinal: 1050, 
        rentabilidade: 0.1, 
        detalhes: 'Simulado' 
    };
    const expectedUrl = `${apiUrl}/simular-investimento`;

    service.simulate(mockRequest).subscribe(result => {
      expect(result.valorFinal).toBe(1050);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    
    req.flush(mockResponse);
  });
});