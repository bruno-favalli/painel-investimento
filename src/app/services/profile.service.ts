import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProfileResponse } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'https://api-caixa.exemplo';//placeholder url, interceptor vai capturar

  constructor(private http: HttpClient) { 

  }
  public getProfile(clientId: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/perfil-risco/${clientId}`);
  }
}
