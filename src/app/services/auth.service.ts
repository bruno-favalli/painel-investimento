import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthRequest, AuthResponse} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://api-caixa.exemplo.com';
  constructor(private http: HttpClient) { }

  public login(loginData: AuthRequest): Observable<AuthResponse> {
    
   
    return this.http.post<AuthResponse>(`${this.apiUrl}/autenticacao/login`, loginData);
  }
}
