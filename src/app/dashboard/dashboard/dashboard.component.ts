import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { Observable} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { ProfileService } from '../../services/profile.service';
import { ProfileResponse } from '../../models/profile.model';
import { InvestmentService } from '../../services/investment.service';
import { Product } from '../../models/product.model';
import { InvestmentHistory } from '../../models/investment-history.model';
import { InvestimentSimulatorComponent } from '../investiment-simulator/investiment-simulator.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';





@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, 
            MatCardModule, 
            MatListModule,
            MatButtonModule, 
            MatIconModule, 
            MatProgressSpinnerModule, 
            MatTableModule, 
            InvestimentSimulatorComponent, 
            NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public profile$!: Observable<ProfileResponse>;
  public products$!: Observable<Product[]>;
  public history$!: Observable<InvestmentHistory[]>;
  public distributionData$!: Observable<any[]>;
  public topProduct$!: Observable<Product | undefined>;

  view: [number, number] = [600, 350];
  scheme: any = {domain: ['#005CA9',  // Primary 90 - Azul CAIXA
  '#f39200',  // Secondary 70 - Laranja
  '#54bbab',  // Tertiary 70 - Turquesa
  '#00b4e6',  // Ceu 70
  '#b26f9b',  // Uva 70
  '#afca0b',  // Limão 70
  '#f9b000',  // Tangerina 70
  '#ef765e' ]};

  public displayedColumns: string[] = ['tipo', 'valor', 'data', 'rentabilidade'];

  private totalValue: number = 0;
  private chartData: any[] = [];

  constructor(
    private profileService: ProfileService,
    private investmentService: InvestmentService,
    private cdr: ChangeDetectorRef
    ) { }

    @ViewChild(InvestimentSimulatorComponent) simulator!: InvestimentSimulatorComponent;

  ngOnInit(): void {
      const clientId = localStorage.getItem('caixa-invest-clientId');

      if (clientId) {
        const idNumber = Number(clientId);

        
        this.profile$ = this.profileService.getProfile(idNumber);
        this.products$ = this.profile$.pipe(
          switchMap((profile) => this.investmentService.getProdutosRecomendados(profile.perfil))
        );
  
        this.topProduct$ = this.products$.pipe(
          map(products => products.length > 0 ? products[0] : undefined)
        );

        // 3. NOVA BUSCA: Histórico de Investimentos
        // Note que não depende do perfil, então chamamos direto usando o ID
        this.history$ = this.investmentService.getInvestmentHistory(idNumber);

        this.distributionData$ = this.history$.pipe(
          // Map transforma o array de Histórico (InvestmentHistory[])
          map(history => {
            // Agrupamos os valores por tipo de investimento (CDB, Fundo, LCI...)
            const grouped = history.reduce((acc, item) => {
              const key = item.tipo;
              // Acumula o valor total investido para cada tipo
              acc[key] = (acc[key] || 0) + item.valor;
              return acc;
            }, {} as { [key: string]: number });

            this.totalValue = Object.values(grouped).reduce((sum, val) => sum + val, 0);
      
            // Converte o objeto agrupado para o formato que o ngx-charts espera
            this.chartData = Object.keys(grouped).map(key => ({
              name: key,
              value: grouped[key]
            }));
            return this.chartData;
          })
        );
      
        }
  else{
    console.error('Client ID não encontrado no localStorage.');
  }
  
  this.cdr.detectChanges();
}
calculatePercentage(value: number): string {
  if (this.totalValue === 0) return '0.0';
  const percentage = (value / this.totalValue) * 100;
  return percentage.toFixed(1);
}

// ✅ Retorna a cor correspondente ao item
getColorForItem(name: string): string {
  const index = this.chartData.findIndex(item => item.name === name);
  return this.scheme.domain[index % this.scheme.domain.length];
}

// ✅ Formata os labels no gráfico (para não cortar)
labelFormatting = (label: string): string => {
  if (label.length > 15) {
    return label.substring(0, 12) + '...';
  }
  return label;
}

// ✅ Formata a legenda com nome + valor + porcentagem
legendLabelFormatting = (label: string): string => {
  return label;
}

// ✅ Formata o valor na legenda (moeda brasileira)
valueFormatting = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ✅ Formata a porcentagem na legenda
percentageFormatting = (value: number): string => {
  if (this.totalValue === 0) return '0%';
  const percentage = (value / this.totalValue) * 100;
  return `${percentage.toFixed(1)}%`;
}

onResize(container: HTMLElement): void {
  if (container) {
    const screenWidth = window.innerWidth;
    let width: number;
    let height: number;

    // ✅ Ajustes específicos por tamanho de tela
    if (screenWidth < 400) {
      // Telas muito pequenas
      width = Math.min(container.offsetWidth - 20, 320);
      height = 260;
    } else if (screenWidth < 600) {
      // Smartphones
      width = Math.min(container.offsetWidth - 20, 380);
      height = 280;
    } else if (screenWidth < 900) {
      // Tablets
      width = Math.min(container.offsetWidth - 40, 450);
      height = 320;
    } else {
      // Desktop
      width = Math.min(container.offsetWidth - 40, 600);
      height = 350;
    }

    this.view = [width, height];
    this.cdr.markForCheck();
  }
}
ngAfterViewInit(): void {
  // console.log('Simulador carregado:', this.simulator);
  setTimeout(() => {
    const container = document.querySelector('.chart-wrapper') as HTMLElement;
    if (container) {
      this.onResize(container);
    }
  }, 100);
}
isSimulating = false;

  simulateProduct(product: Product): void {
    this.isSimulating = true;
    this.simulator.simulateProduct(product);
    
    // Simula um delay de carregamento
    setTimeout(() => {
      this.isSimulating = false;
      this.cdr.markForCheck();
    }, 1000);
  }
  getTotalInvestido(): number {
    if (!this.chartData || this.chartData.length === 0) return 0;
    return this.chartData.reduce((sum, item) => sum + item.value, 0);
  }
  
  getRentabilidadeMedia(): number {
    // Calcula rentabilidade média baseada no histórico
    return 0.0875; // 8,75% - Você pode calcular dinamicamente do seu histórico
  }
  
  getMaiorInvestimento(): string {
    if (!this.chartData || this.chartData.length === 0) return '-';
    const maior = this.chartData.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return maior.name;
  }
  
  getNumeroAtivos(): number {
    return this.chartData ? this.chartData.length : 0;
  }
  
  getUltimoInvestimento(history: any[]): Date {
    if (!history || history.length === 0) return new Date();
    // Ordena por data e pega o mais recente
    const sorted = history.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    return sorted[0].data;
  }
  
}
