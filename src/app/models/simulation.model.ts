// Dados que enviamos para a API

export interface SimulationRequest {
    valor: number;
    prazoMeses: number;
    tipo: string; 
  }
  
  // Dados que a API devolve

  export interface SimulationResponse {
    valorFinal: number;
    rentabilidade: number; 
    detalhes: string;
  }