import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import{Product} from '../models/product.model';
import { InvestmentHistory } from '../models/investment-history.model';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  private apiUrl = 'https://api-caixa.exemplo.com'; 

  constructor(private http: HttpClient) { }

  public getProdutosRecomendados(perfil: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produtos-recomendados/${perfil}`);
}

  public getInvestmentHistory(clientId: number): Observable<InvestmentHistory[]> {
    return this.http.get<InvestmentHistory[]>(`${this.apiUrl}/investimentos/${clientId}`);
  }

  public simulate(request: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(`${this.apiUrl}/simular-investimento`, request);
}
}
