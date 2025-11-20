import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs'; 
import { delay } from 'rxjs/operators'; // simular uma demora da rede

import { AuthResponse } from '../models/auth.model';
import { ProfileResponse } from '../models/profile.model';
import { Product } from '../models/product.model';
import { InvestmentHistory } from '../models/investment-history.model';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('INTERCEPTOR: Requisição capturada!', req.url);


  // Verifica se a URL é a de login E se o método  POST
  if (req.url.endsWith('/autenticacao/login') && req.method === 'POST') {
    
    // Logamos o corpo da requisição para ver se os dados do form chegaram
    console.log('INTERCEPTOR: Recebeu dados de login:', req.body);

    // Criamos uma resposta falsa (mock) baseada no documento 
    const mockLoginResponse: AuthResponse = {
      token: 'eyJhbGciOiJIUzI1NilsInR5cCl6lkpXVCJ9.TOKEN_FALSO_GERADO_PELO_INTERCEPTOR',
      clientId: 123
    };

    // Criamos uma HttpResponse completa com status 200 (OK)
    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockLoginResponse
    });

    // Usamos 'of()' para retornar um Observable com a resposta falsa
    // Usamos 'delay(500)' para simular 0.5 segundos de espera da rede
    return of(httpResponse).pipe(delay(500));
  }

  if (req.url.includes('/perfil-risco/') && req.method === 'GET') {
    
    const clientId = req.url.split('/').pop();
    console.log('INTERCEPTOR: Capturando perfil para clientId:', clientId);

    let perfil = 'Moderado';
    let pontuacao = 65;
    let nomeCliente = 'Rafael Souza'; // <-- Valor Padrão (Moderado)
    let descricao = 'Perfil equilibrado entre segurança e rentabilidade.';

    // 1. Lógica Dinâmica: Perfil e Nome
    if (clientId === '101') {
        perfil = 'Conservador';
        pontuacao = 30;
        nomeCliente = 'Ana Silva';
        descricao = 'Foco em segurança e liquidez, baixo risco.';
    } else if (clientId === '202') {
        perfil = 'Agressivo';
        pontuacao = 85;
        nomeCliente = 'Marcos Oliveira';
        descricao = 'Foco em alta rentabilidade, disposto a correr altos riscos.';
    }
    const mockProfileResponse: ProfileResponse = {
            clientId: Number(clientId),
            nomeCliente: nomeCliente, // <-- Usa o nome do cliente correto (Marcos Oliveira)
            perfil: perfil, // <-- CORRIGIDO: Usa a variável 'perfil' ('Agressivo', 'Moderado', etc.)
            descricao: descricao, // <-- CORRIGIDO: Usa a descrição dinâmica
            pontuacao: pontuacao // <-- CORRIGIDO: Usa a pontuação dinâmica
          };

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockProfileResponse
    });

    return of(httpResponse).pipe(delay(800));
  }

  if(req.url.includes('/produtos-recomendados/') && req.method === 'GET') {
    const perfil = req.url.split('/').pop();
    console.log(`INTERCEPTOR: Buscando produtos para o perfil: ${perfil}`);

    let mockProductsResponse: Product[] = [];

    switch (perfil) {
      case 'Conservador':
          mockProductsResponse = [
              // CDB, LCI, Tesouro Selic (Rentabilidades Baixas e Seguras)
              { id: 101, nome: "CDB CAIXA Pós 100% CDI", tipo: "CDB", rentabilidade: 0.115, risco: "Baixo" },
              { id: 102, nome: "LCI Isenta Curta Duração", tipo: "LCI", rentabilidade: 0.098, risco: "Baixo" }, // Abaixo de 10%
              { id: 103, nome: "Tesouro Selic", tipo: "Tesouro Direto", rentabilidade: 0.125, risco: "Baixo" },
          ];
          break;
      case 'Agressivo':
          mockProductsResponse = [
              // Ações e Fundos (Rentabilidades Altas e Voláteis)
              { id: 201, nome: "Fundo Ações NASDAQ", tipo: "Fundo", rentabilidade: 0.25, risco: "Alto" }, // 25%
              { id: 202, nome: "Fundo Multimercado High Yield", tipo: "Fundo Multimercado", rentabilidade: 0.185, risco: "Médio-Alto" }, // 18.5%
          ];
          break;
      case 'Moderado': // Padrão
      default:
          mockProductsResponse = [
              // CDB e Tesouro IPCA+ (Rentabilidades Médias)
              { id: 301, nome: "CDB Prefixado 2026", tipo: "CDB", rentabilidade: 0.142, risco: "Médio" }, // 14.2%
              { id: 302, nome: "Tesouro IPCA+", tipo: "Tesouro Direto", rentabilidade: 0.076, risco: "Médio" }, // 7.6% + IPCA
          ];
          break;
  }

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockProductsResponse
    });
    return of(httpResponse).pipe(delay(1200));
  }

  // --- Simulação: Histórico de Investimentos ---
if (req.url.includes('/investimentos/') && req.method === 'GET') {
    
  const clientId = req.url.split('/').pop();
  let mockHistoryResponse: InvestmentHistory[] = [];

  // Lógica Dinâmica: Histórico de Investimentos por Perfil
  if (clientId === '101') {
      // Conservador: Mais CDB e LCI, pouco Fundo
      mockHistoryResponse = [
          { "id": 1, "tipo": "CDB", "valor": 8000, "rentabilidade": 0.11, "data": "2025-01-15" },
          { "id": 2, "tipo": "LCI", "valor": 6000, "rentabilidade": 0.09, "data": "2025-03-10" },
          { "id": 3, "tipo": "Fundo Renda Fixa", "valor": 1000, "rentabilidade": 0.07, "data": "2025-04-02" }
      ];
  } else if (clientId === '202') {
      // Agressivo: Mais Ações e Fundos Multimercado
      mockHistoryResponse = [
          { "id": 1, "tipo": "Ações", "valor": 12000, "rentabilidade": 0.20, "data": "2025-01-15" },
          { "id": 2, "tipo": "Fundo Multimercado", "valor": 8000, "rentabilidade": 0.15, "data": "2025-03-10" },
          { "id": 3, "tipo": "Tesouro Direto", "valor": 500, "rentabilidade": 0.12, "data": "2025-04-02" }
      ];
  } else {
      // Moderado (Padrão): CDB e Tesouro
      mockHistoryResponse = [
          { "id": 1, "tipo": "CDB", "valor": 5000, "rentabilidade": 0.12, "data": "2025-01-15" },
          { "id": 2, "tipo": "Tesouro Direto", "valor": 3000, "rentabilidade": 0.11, "data": "2025-03-10" },
          { "id": 3, "tipo": "Fundo Multimercado", "valor": 2000, "rentabilidade": 0.08, "data": "2025-04-02" }
      ];
  }

  const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockHistoryResponse
  });

  return of(httpResponse).pipe(delay(1500));
}

  // --- Simulação: Simulador de Investimento ---
if (req.url.endsWith('/simular-investimento') && req.method === 'POST') {
    
    const requestData = req.body as SimulationRequest;
    
    // 1. Lógica Dinâmica: Taxa de retorno baseada no tipo de investimento (proxy para risco)
    let taxaMensal: number;

    switch (requestData.tipo) {
        case 'CDB':
        case 'LCI':
        case 'LCA':
        case 'Fundo Renda Fixa': // <-- NOVO: Renda Fixa é de baixo risco
            taxaMensal = 0.01; // 1% ao mês
            break;
        case 'Tesouro Direto':
            taxaMensal = 0.011; // 1.1% ao mês
            break;
        case 'Fundo':
        case 'Fundo Multimercado': // <-- JÁ EXISTIA
        case 'Ações': // <-- NOVO: Ações/Fundo de alto risco
            taxaMensal = 0.015; // 1.5% ao mês (Alto Risco)
            break;
        default:
            taxaMensal = 0.01;
    }

    // 2. Cálculo
    const lucro = requestData.valor * (taxaMensal * requestData.prazoMeses);
    const total = requestData.valor + lucro;
    const taxaAnual = taxaMensal * 12;

    const mockSimulationResponse: SimulationResponse = {
        valorFinal: total,
        rentabilidade: taxaAnual,
        detalhes: `Simulação baseada em ${requestData.tipo} com taxa aproximada de ${taxaAnual * 100}% ao ano.`
    };

    const httpResponse = new HttpResponse({
        status: 200,
        statusText: 'OK',
        body: mockSimulationResponse
    });

    return of(httpResponse).pipe(delay(1000));
}
  return next(req);
};