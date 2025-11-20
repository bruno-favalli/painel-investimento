import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestimentSimulatorComponent } from './investiment-simulator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { InvestmentService } from '../../services/investment.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'; // Importar módulos Material usados no componente

describe('InvestmentSimulatorComponent', () => {
  let component: InvestimentSimulatorComponent;
  let fixture: ComponentFixture<InvestimentSimulatorComponent>;
  let investmentService: InvestmentService;

  // Mock da resposta do serviço de simulação [cite: 104-108]
  const mockSimulationResponse = {
    valorFinal: 11000,
    rentabilidade: 0.1,
    detalhes: 'Simulação de teste concluída.'
  };

  // Espião (spy) para simular o serviço de investimento
  const investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['simulate']);

  beforeEach(async () => {
    // Configura o spy para retornar um Observable de sucesso
    investmentServiceSpy.simulate.and.returnValue(of(mockSimulationResponse));

    await TestBed.configureTestingModule({
      // Componente Standalone sendo testado
      imports: [InvestimentSimulatorComponent, ReactiveFormsModule, MatCardModule], 
      
      // Provedores necessários
      providers: [
        // Solução para o NullInjectorError do HttpClient
        importProvidersFrom(HttpClientTestingModule),
        // Fornece o espião no lugar do serviço real
        { provide: InvestmentService, useValue: investmentServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestimentSimulatorComponent);
    component = fixture.componentInstance;
    // Injeta a instância do serviço (que é o nosso spy)
    investmentService = TestBed.inject(InvestmentService); 
    fixture.detectChanges();
  });

  // ----------------------------------------------------
  // TESTES DE CRIAÇÃO E INICIALIZAÇÃO
  // ----------------------------------------------------
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values (1000, 12, CDB)', () => {
    expect(component.simulationForm.get('valor')?.value).toBe(1000);
    expect(component.simulationForm.get('prazoMeses')?.value).toBe(12);
    expect(component.simulationForm.get('tipo')?.value).toBe('CDB');
  });

  it('should be invalid if Value is missing or less than 100', () => {
    component.simulationForm.get('valor')?.setValue(50);
    expect(component.simulationForm.invalid).toBeTrue();
  });

  // ----------------------------------------------------
  // TESTES DE SUBMISSÃO
  // ----------------------------------------------------
  it('should call InvestmentService.simulate on form submission', () => {
    // Garante que o formulário está válido para submissão
    component.simulationForm.get('valor')?.setValue(5000);
    component.simulationForm.get('prazoMeses')?.setValue(18);

    component.onSimulate(); 

    // Verifica se o método do serviço foi chamado com os dados do formulário
    expect(investmentServiceSpy.simulate).toHaveBeenCalledWith({
      valor: 5000,
      prazoMeses: 18,
      tipo: 'CDB' // Valor padrão
    });
  });

  it('should store simulation result in simulationResult$ observable', (done) => {
    component.simulationForm.get('valor')?.setValue(1000);
    component.onSimulate();
    
    // Testa se o Observable foi atualizado com o valor mockado
    component.simulationResult$?.subscribe(result => {
      expect(result.valorFinal).toBe(11000);
      expect(result.detalhes).toContain('concluída');
      done(); // Sinaliza que o teste assíncrono terminou
    });
  });

  it('should NOT call simulate if the form is invalid', () => {
    investmentServiceSpy.simulate.calls.reset();
    component.simulationForm.get('valor')?.setValue(null);
    fixture.detectChanges();
    component.onSimulate();
    expect(investmentServiceSpy.simulate).not.toHaveBeenCalled();
  });
});