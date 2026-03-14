import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { ITransaction } from '../../../../core/interfaces';

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [CopCurrencyPipe, DatePipe],
  templateUrl: './transaction-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionItemComponent {
  readonly transaction = input.required<ITransaction>();
}
