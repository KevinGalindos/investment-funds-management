import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { IFund } from '../interfaces';

import { API_CONFIG } from '../constants/config.constants';

@Injectable({ providedIn: 'root' })
export class FundService {
  private readonly http = inject(HttpClient);

  private readonly _funds = signal<IFund[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly funds = computed(() => this._funds());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  loadFunds(): Observable<IFund[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<IFund[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FUNDS}`).pipe(
      tap((funds) => {
        this._funds.set(funds);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Error al cargar los fondos.');
        this._loading.set(false);
        console.error('[FundService] Error loading funds:', err);
        return of([]);
      }),
    );
  }

  getFundById(id: number): IFund | undefined {
    return this._funds().find((f) => f.id === id);
  }
}
