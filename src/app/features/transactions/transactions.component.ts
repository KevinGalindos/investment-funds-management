import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionType } from '../../core/interfaces';
import { TransactionSummaryComponent } from './components/transaction-summary/transaction-summary.component';
import { TransactionFiltersComponent } from './components/transaction-filters/transaction-filters.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';

type FilterType = 'all' | TransactionType;

/**
 * Página de historial: muestra el listado de transacciones en tabla o cards.
 * Implementa filtros por tipo de movimiento.
 */
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TransactionSummaryComponent,
    TransactionFiltersComponent,
    TransactionListComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
  protected readonly transactionService = inject(TransactionService);

  protected readonly activeFilter = signal<FilterType>('all');

  protected readonly filters: { label: string; value: FilterType }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Suscripciones', value: 'subscribe' },
    { label: 'Cancelaciones', value: 'cancel' },
  ];

  /** Signal computado: transacciones filtradas */
  protected readonly filteredTransactions = computed(() => {
    const all = this.transactionService.transactions();
    const filter = this.activeFilter();

    if (filter === 'all') return all;
    return all.filter((t) => t.type === filter);
  });

  ngOnInit(): void {
    this.transactionService.loadTransactions().subscribe();
  }
}
