import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import type { IFund } from '../../../../core/interfaces';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { CategoryBadgeComponent } from '../../../../shared/components/category-badge/category-badge.component';

@Component({
  selector: 'app-fund-card',
  standalone: true,
  imports: [CopCurrencyPipe, CategoryBadgeComponent],
  templateUrl: './fund-card.component.html',
  styleUrl: './fund-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundCardComponent {
  readonly fund = input.required<IFund>();

  readonly isSubscribed = input<boolean>(false);

  readonly subscribe = output<IFund>();
}
