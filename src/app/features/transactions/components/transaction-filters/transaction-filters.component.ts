import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TransactionType } from '../../../../core/interfaces';

type FilterType = 'all' | TransactionType;

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [],
  templateUrl: './transaction-filters.component.html',
  styleUrl: './transaction-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFiltersComponent {
  readonly activeFilter = input.required<FilterType>();
  readonly filterChange = output<FilterType>();

  protected readonly filters: { label: string; value: FilterType }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Suscripciones', value: 'subscribe' },
    { label: 'Cancelaciones', value: 'cancel' },
  ];
}
