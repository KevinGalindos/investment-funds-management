import { Component, input } from '@angular/core';
import { FundCategory } from '../../../core/interfaces';

/**
 * Componente reutilizable de badge/etiqueta para categoría de fondo.
 * FPV = azul/indigo, FIC = violeta/púrpura.
 */
@Component({
  selector: 'app-category-badge',
  standalone: true,
  templateUrl: './category-badge.component.html',
  styleUrl: './category-badge.component.css',
})
export class CategoryBadgeComponent {
  /** Categoría del fondo */
  readonly category = input.required<FundCategory>();

  /**
   * Clases CSS del badge según categoría.
   */
  protected badgeClasses(): string {
    return this.category() === 'FPV'
      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
      : 'bg-violet-500/15 text-violet-400 border border-violet-500/20';
  }

  /**
   * Clase CSS del punto indicador.
   */
  protected dotClass(): string {
    return this.category() === 'FPV' ? 'bg-indigo-400' : 'bg-violet-400';
  }
}
