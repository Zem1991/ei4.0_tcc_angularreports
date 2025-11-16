import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Temperature {
  id: number;
  value: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  // private apiUrl = 'https://ei40tccservice20251116142403.azurewebsites.net/Temperature';
  private apiUrl = '/Temperature';  //changed when enabling CORS

  constructor(private http: HttpClient) {}

  getTemperatures(): Observable<Temperature[]> {
    console.log('calling ' + this.apiUrl);
    return this.http.get<Temperature[]>(this.apiUrl).pipe(
      map((data: Temperature[]) => {
        // garante que está ordenado por timestamp
        const sorted = data.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        // pega apenas os últimos 20
        return sorted.slice(-20);
      })
    );
  }
}
