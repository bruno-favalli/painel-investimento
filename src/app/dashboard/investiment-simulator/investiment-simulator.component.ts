import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-investiment-simulator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './investiment-simulator.component.html',
  styleUrl: './investiment-simulator.component.scss'
})
export class InvestimentSimulatorComponent implements OnInit {
  simulatorForm!: FormGroup;
  resultado: any = null; // armazenar o resultado

  // Taxas de rentabilidade por tipo de investimento (
  private taxas: { [key: string]: number } = {
    'CDB': 0.0095, // 0.95% ao mês
    'Tesouro Direto': 0.0075, // 0.75% ao mês
    'Fundo Multimercado': 0.01, // 1% ao mês
    'Ações': 0.015 // 1.5% ao mês (mais arriscado)
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Inicializar formulário com validações
    this.simulatorForm = this.formBuilder.group({
      valor: [1000, [Validators.required, Validators.min(100)]],
      prazo: [12, [Validators.required, Validators.min(1), Validators.max(360)]],
      tipo: ['CDB', Validators.required]
    });
  }

  //  Função para simular o investimento
  simulate(): void {
    if (this.simulatorForm.valid) {
      const { valor, prazo, tipo } = this.simulatorForm.value;
      
      // Pega a taxa mensal do tipo de investimento selecionado
      const taxaMensal = this.taxas[tipo] || 0.01;
      
      // Calcula o valor final com juros compostos
      const valorFinal = valor * Math.pow(1 + taxaMensal, prazo);
      const rendimento = valorFinal - valor;

      // Armazena o resultado
      this.resultado = {
        valorInicial: valor,
        prazo: prazo,
        tipo: tipo,
        valorFinal: valorFinal,
        rendimento: rendimento,
        taxaMensal: taxaMensal
      };

      // Log para debug
      console.log('Simulação realizada:', this.resultado);
    } else {
      // Marca todos os campos como touched para mostrar erros
      Object.keys(this.simulatorForm.controls).forEach(key => {
        this.simulatorForm.get(key)?.markAsTouched();
      });
    }
  }

  // Função para simular produto específico (chamada pelo dashboard)
  simulateProduct(product: any): void {
    // Preenche o formulário com dados do produto
    this.simulatorForm.patchValue({
      valor: 1000, // Valor padrão
      prazo: 12, // Prazo padrão
      tipo: product.tipo
    });

    // Executa a simulação automaticamente
    this.simulate();

    // Scroll suave até o simulador
    setTimeout(() => {
      const simulatorElement = document.querySelector('.simulator-card');
      if (simulatorElement) {
        simulatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
