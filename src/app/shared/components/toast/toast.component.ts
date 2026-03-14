import { Component, inject } from '@angular/core';
import { ToastService, IToastMessage } from '../../../core/services/toast.service';

/**
 * Componente reutilizable de notificaciones toast.
 * Se renderiza como overlay flotante en la esquina superior derecha.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  /**
   * Retorna clases CSS según el tipo de toast para estilos diferenciados.
   */
  protected getToastClasses(type: string): string {
    const base =
      'rounded-xl px-5 py-4 shadow-2xl border backdrop-blur-xl animate-slide-in flex items-start gap-3';
    const variants: Record<string, string> = {
      success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      error: 'bg-red-500/10 border-red-500/30 text-red-300',
      warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      info: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    };
    return `${base} ${variants[type] ?? variants['info']}`;
  }

  /**
   * Retorna el icono emoji según el tipo de toast.
   */
  protected getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[type] ?? '💬';
  }
}
