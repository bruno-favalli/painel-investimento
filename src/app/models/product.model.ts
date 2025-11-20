
export interface Product {
  id: number;
  nome: string;
  tipo: string;   
  rentabilidade: number; // Ex: 0.13 (para 13%)
  risco: string;  // Ex: "Baixo", "Alto"
}