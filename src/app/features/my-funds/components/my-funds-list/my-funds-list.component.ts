import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { FundService } from '../../../../core/services/fund.service';
import { ISubscription } from '../../../../core/interfaces';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { CategoryBadgeComponent } from '../../../../shared/components/category-badge/category-badge.component';

@Component({
  selector: 'app-my-funds-list',
  standalone: true,
  imports: [DatePipe, RouterLink, CopCurrencyPipe, CategoryBadgeComponent],
  templateUrl: './my-funds-list.component.html',
  styleUrl: './my-funds-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFundsListComponent {
  protected readonly userService = inject(UserService);
  private readonly fundService = inject(FundService);

  readonly cancelFund = output<ISubscription>();

  protected getFundCategory(fundId: number): 'FPV' | 'FIC' | null {
    const fund = this.fundService.getFundById(fundId);
    return fund?.category ?? null;
  }
}
