import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { ITransaction, NotificationMethod } from '../interfaces';
import { API_CONFIG } from '../constants/config.constants';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);

  private readonly _transactions = signal<ITransaction[]>([]);
  private readonly _loading = signal<boolean>(false);

  readonly transactions = this._transactions.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly totalSubscriptions = computed(
    () => this._transactions().filter((t) => t.type === 'subscribe').length,
  );
  readonly totalCancellations = computed(
    () => this._transactions().filter((t) => t.type === 'cancel').length,
  );

  loadTransactions(): Observable<ITransaction[]> {
    this._loading.set(true);

    return this.http
      .get<ITransaction[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`)
      .pipe(
        tap((transactions) => {
          const sorted = [...transactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          this._transactions.set(sorted);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._loading.set(false);
          console.error('[TransactionService] Error loading transactions:', err);
          return of([]);
        }),
      );
  }

  addTransaction(
    fundId: number,
    fundName: string,
    type: 'subscribe' | 'cancel',
    amount: number,
    notificationMethod: NotificationMethod,
  ): Observable<ITransaction> {
    const transaction: ITransaction = {
      id: crypto.randomUUID(),
      fundId,
      fundName,
      type,
      amount,
      date: new Date().toISOString(),
      notificationMethod,
    };

    return this.http
      .post<ITransaction>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`, transaction)
      .pipe(
        tap(() => {
          this._transactions.update((current) => [transaction, ...current]);
        }),
        catchError((err) => {
          console.error(
            '[TransactionService] Critical: Error saving transaction to backend. Recovering locally.',
            err,
          );
          this._transactions.update((current) => [transaction, ...current]);
          return of(transaction);
        }),
      );
  }
}
