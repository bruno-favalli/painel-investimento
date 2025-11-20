import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { InvestmentService } from '../../services/investment.service';
import { SimulationResponse } from '../../models/simulation.model';
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-investiment-simulator',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './investiment-simulator.component.html',
  styleUrl: './investiment-simulator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestimentSimulatorComponent {

  simulationForm: FormGroup;
  simulationResult$!: Observable<SimulationResponse>;

  tiposInvestimento = [
    'CDB', 
    'LCI', 
    'LCA', 
    'Tesouro Direto', 
    'Fundo', 
    'Fundo Multimercado', 
    'Fundo Renda Fixa', 
    'Ações'];

  constructor(
    private fb: FormBuilder,
    private investmentService: InvestmentService
  ) {
    this.simulationForm = this.fb.group({
      valor: [1000, [Validators.required, Validators.min(100)]],
      prazoMeses: [12, [Validators.required, Validators.min(1)]],
      tipo: ['CDB', Validators.required] 
    });
  }
  onSimulate(): void {
    if (this.simulationForm.valid) {
      this.simulationResult$ = this.investmentService.simulate(this.simulationForm.value);
  }
  }
  public simulateProduct(product: Product): void {
    
    // 1. Define os valores no formulário. Usamos um valor e prazo padrão, 
    //    mas o tipo e a rentabilidade (implícita) são do produto.
    this.simulationForm.patchValue({
      valor: 5000, // Valor padrão, pode ser ajustado
      prazoMeses: 24, // Prazo padrão
      tipo: product.tipo // Tipo do produto em destaque (ex: 'CDB')
    });

    // 2. Chama a simulação (se o formulário estiver válido)
    this.onSimulate();
  }

}
