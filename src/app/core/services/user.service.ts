import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, map, catchError, of, throwError } from 'rxjs';
import { IUser, IFund, ISubscription, ISubscriptionRequest } from '../interfaces';
import { TransactionService } from './transaction.service';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

import { API_CONFIG } from '../constants/config.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly transactionService = inject(TransactionService);
  private readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);

  private readonly _user = signal<IUser | null>(null);
  private readonly _loading = signal<boolean>(false);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly balance = computed(() => this._user()?.balance ?? 0);
  readonly subscribedFunds = computed(() => {
    const funds = this._user()?.subscribedFunds ?? [];
    return [...funds].sort(
      (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime(),
    );
  });
  readonly userName = computed(() => this._user()?.name ?? 'Usuario');
  readonly subscribedCount = computed(() => this.subscribedFunds().length);
  readonly totalInvested = computed(() =>
    this.subscribedFunds().reduce((sum, sub) => sum + sub.amount, 0),
  );

  loadUser(): Observable<IUser> {
    this._loading.set(true);

    return this.http.get<IUser>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`).pipe(
      tap((user) => {
        this._user.set(user);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this.toastService.error('Error al cargar los datos del usuario.');
        console.error('[UserService] Error loading user:', err);
        return throwError(() => err);
      }),
    );
  }

  subscribeTo(fund: IFund, request: ISubscriptionRequest): Observable<boolean> {
    const currentUser = this._user();

    if (!currentUser) {
      this.toastService.error('Error: No se han cargado los datos del usuario.');
      return of(false);
    }

    if (currentUser.subscribedFunds.some((s) => s.fundId === fund.id)) {
      this.toastService.warning(`Ya estás suscrito al fondo ${fund.name}.`);
      return of(false);
    }

    if (request.amount < fund.minimumAmount) {
      this.toastService.error(
        `El monto solicitado (${request.amount}) es inferior al mínimo requerido para el fondo ${fund.name}.`,
      );
      return of(false);
    }

    if (currentUser.balance < request.amount) {
      this.toastService.error(
        `No tiene saldo suficiente para invertir ${request.amount} en el fondo ${fund.name}.`,
      );
      return of(false);
    }

    this._loading.set(true);

    const newSubscription: ISubscription = {
      fundId: fund.id,
      fundName: fund.name,
      amount: request.amount,
      notificationMethod: request.notificationMethod,
      subscribedAt: new Date().toISOString(),
    };

    const updatedUser: IUser = {
      ...currentUser,
      balance: currentUser.balance - request.amount,
      subscribedFunds: [...currentUser.subscribedFunds, newSubscription],
    };

    return this.http
      .put<IUser>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`, updatedUser)
      .pipe(
        switchMap(() =>
          this.transactionService.addTransaction(
            fund.id,
            fund.name,
            'subscribe',
            request.amount,
            request.notificationMethod,
          ),
        ),
        tap(() => {
          this._user.set(updatedUser);
          this._loading.set(false);
          this.notificationService.sendNotification(
            request.notificationMethod,
            fund.name,
            'subscribe',
          );
          this.toastService.success(`✅ Suscripción exitosa al fondo ${fund.name}`);
        }),
        map(() => true),
        catchError((err) => {
          this._loading.set(false);
          this.toastService.error('Error al procesar la suscripción.');
          console.error('[UserService] Error subscribing:', err);
          return of(false);
        }),
      );
  }

  cancelSubscription(fundId: number): Observable<boolean> {
    const currentUser = this._user();

    if (!currentUser) {
      this.toastService.error('Error: Usuario no cargado.');
      return of(false);
    }

    const subscription = currentUser.subscribedFunds.find((s) => s.fundId === fundId);

    if (!subscription) {
      this.toastService.warning('No se encontró una suscripción activa para este fondo.');
      return of(false);
    }

    this._loading.set(true);

    const updatedUser: IUser = {
      ...currentUser,
      balance: currentUser.balance + subscription.amount,
      subscribedFunds: currentUser.subscribedFunds.filter((s) => s.fundId !== fundId),
    };

    return this.http
      .put<IUser>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`, updatedUser)
      .pipe(
        switchMap(() =>
          this.transactionService.addTransaction(
            subscription.fundId,
            subscription.fundName,
            'cancel',
            subscription.amount,
            subscription.notificationMethod,
          ),
        ),
        tap(() => {
          this._user.set(updatedUser);
          this._loading.set(false);
          this.notificationService.sendNotification(
            subscription.notificationMethod,
            subscription.fundName,
            'cancel',
          );
          this.toastService.success(`Cancelación exitosa del fondo ${subscription.fundName}.`);
        }),
        map(() => true),
        catchError((err) => {
          this._loading.set(false);
          this.toastService.error('Error al cancelar la suscripción.');
          console.error('[UserService] Error cancelling:', err);
          return of(false);
        }),
      );
  }

  isSubscribedTo(fundId: number): boolean {
    return this.subscribedFunds().some((s) => s.fundId === fundId);
  }
}
