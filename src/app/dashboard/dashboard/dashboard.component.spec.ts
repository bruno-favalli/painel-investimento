import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { InvestmentService } from '../../services/investment.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Importado para resolver a dependência do componente filho (Simulador)
import { FormBuilder } from '@angular/forms'; 

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let profileService: ProfileService;
  let investmentService: InvestmentService;

  // Mock de dados de retorno para evitar requisições reais
  const mockProfile = { clientId: 123, perfil: 'Moderado', descricao: 'Teste', pontuacao: 50 };
  const mockProducts = [{ id: 1, nome: 'CDB', tipo: 'CDB', rentabilidade: 0.1, risco: 'Baixo' }];
  const mockHistory = [{ id: 1, tipo: 'LCI', valor: 1000, rentabilidade: 0.05, data: '2024-01-01' }];

  // Espiões (spies) para simular o retorno dos serviços
  const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfile']);
  const investmentServiceSpy = jasmine.createSpyObj('InvestmentService', [
    'getProdutosRecomendados',
    'getInvestmentHistory',
    'simulate' // Incluir este método mesmo que não seja usado diretamente pelo Dashboard
  ]);

  beforeEach(async () => {
    // Garante que o localStorage tem o ID para o ngOnInit não falhar
    spyOn(localStorage, 'getItem').and.returnValue('123'); 

    // Configura o retorno dos spys
    profileServiceSpy.getProfile.and.returnValue(of(mockProfile));
    investmentServiceSpy.getProdutosRecomendados.and.returnValue(of(mockProducts));
    investmentServiceSpy.getInvestmentHistory.and.returnValue(of(mockHistory));

    await TestBed.configureTestingModule({
      // Componente Standalone sendo testado
      imports: [DashboardComponent, MatCardModule, BrowserAnimationsModule], 
      
      // Provedores necessários
      providers: [
        // 1. Solução para o NullInjectorError (HTTP)
        importProvidersFrom(HttpClientTestingModule),
        // 2. Mock dos Serviços (Spies)
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: InvestmentService, useValue: investmentServiceSpy },
        // 3. Fornecer FormBuilder para satisfazer o componente filho (Simulador)
        FormBuilder, 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
    investmentService = TestBed.inject(InvestmentService);
    
    // Dispara o ngOnInit e processa o switchMap
    fixture.detectChanges(); 
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should call all necessary services on initialization (ngOnInit)', () => {
    // Garante que o Angular processou o switchMap e as chamadas
    fixture.detectChanges(); 

    component.products$.subscribe();
    
    // Verifica a chamada do Perfil
    expect(profileServiceSpy.getProfile).toHaveBeenCalledWith(123);
    
    // Verifica a chamada do Histórico (paralelo)
    expect(investmentServiceSpy.getInvestmentHistory).toHaveBeenCalledWith(123);
    
    // Verifica a chamada de Produtos (encadeado via switchMap)
    expect(investmentServiceSpy.getProdutosRecomendados).toHaveBeenCalledWith('Moderado');
  });

  it('should handle missing clientId gracefully', () => {
    // Redefine o spy para simular o localStorage vazio
    profileServiceSpy.getProfile.calls.reset();
    investmentServiceSpy.getInvestmentHistory.calls.reset();
    investmentServiceSpy.getProdutosRecomendados.calls.reset();
    (localStorage.getItem as jasmine.Spy).withArgs('caixa-invest-clientId').and.returnValue(null);
    
    // Cria um novo componente para forçar o ngOnInit com ID faltando
    const newFixture = TestBed.createComponent(DashboardComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges(); // Força o ngOnInit

    // Verifica se as chamadas de API NÃO foram feitas
    expect(profileServiceSpy.getProfile).not.toHaveBeenCalled();
    expect(investmentServiceSpy.getInvestmentHistory).not.toHaveBeenCalled();
  });
});