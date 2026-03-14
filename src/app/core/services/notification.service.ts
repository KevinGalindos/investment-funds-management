import { Injectable, inject } from '@angular/core';
import { NotificationMethod } from '../interfaces';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastService = inject(ToastService);

  sendNotification(
    method: NotificationMethod,
    fundName: string,
    type: 'subscribe' | 'cancel',
  ): void {
    const action = type === 'subscribe' ? 'suscripción' : 'cancelación';
    const channel = method === 'email' ? 'correo electrónico' : 'SMS';
    const message = `Notificación enviada por ${channel}: ${action} al fondo ${fundName} realizada exitosamente.`;

    console.log(`[NotificationService] ${message}`);
    this.toastService.info(
      `📩 ${method === 'email' ? 'Email' : 'SMS'} enviado: Confirmación de ${action}`,
    );
  }
}
