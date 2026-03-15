import { Injectable, signal } from '@angular/core';
import { API_CONFIG } from '../constants/config.constants';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface IToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<IToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  success(message: string, duration = API_CONFIG.TOAST.SUCCESS_DURATION_MS): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = API_CONFIG.TOAST.ERROR_DURATION_MS): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = API_CONFIG.TOAST.WARNING_DURATION_MS): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = API_CONFIG.TOAST.INFO_DURATION_MS): void {
    this.show(message, 'info', duration);
  }

  private show(message: string, type: ToastType, duration: number): void {
    const id = this.nextId++;
    const toast: IToastMessage = { id, message, type, duration };

    this._toasts.update((current) => [...current, toast]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this._toasts.update((current) => current.filter((t) => t.id !== id));
  }
}