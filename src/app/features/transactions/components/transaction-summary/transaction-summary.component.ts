import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [],
  templateUrl: './transaction-summary.component.html',
  styleUrl: './transaction-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionSummaryComponent {
  protected readonly transactionService = inject(TransactionService);
}
