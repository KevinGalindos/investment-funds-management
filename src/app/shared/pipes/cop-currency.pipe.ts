import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado para formatear valores monetarios en pesos colombianos.
 * Ejemplo: 500000 → "COP $500.000"
 *
 * @usageNotes
 * ```html
 * {{ 500000 | copCurrency }}        → "COP $500.000"
 * {{ 500000 | copCurrency:false }}  → "$500.000"
 * ```
 */
@Pipe({
  name: 'copCurrency',
  standalone: true,
})
export class CopCurrencyPipe implements PipeTransform {
  private static readonly formatter = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  transform(value: number | null | undefined, showPrefix = true): string {
    if (value === null || value === undefined) {
      return showPrefix ? 'COP $0' : '$0';
    }

    const formatted = CopCurrencyPipe.formatter.format(value);

    return showPrefix ? `COP $${formatted}` : `$${formatted}`;
  }
}
