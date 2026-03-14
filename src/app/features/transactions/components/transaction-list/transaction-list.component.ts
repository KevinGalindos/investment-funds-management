import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ITransaction } from '../../../../core/interfaces';
import { TransactionService } from '../../../../core/services/transaction.service';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CopCurrencyPipe, LoadingSpinnerComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  protected readonly transactionService = inject(TransactionService);
  readonly transactions = input.required<ITransaction[]>();
}
