import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FundService } from '../../core/services/fund.service';
import { UserService } from '../../core/services/user.service';
import { IFund, NotificationMethod } from '../../core/interfaces';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';
import { FundsListComponent } from './components/funds-list/funds-list.component';
import { ActionDialogComponent } from '../../shared/components/action-dialog/action-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-funds',
  standalone: true,
  imports: [
    FundsSummaryComponent,
    FundsListComponent,
    ActionDialogComponent,
    CopCurrencyPipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './funds.component.html',
  styleUrl: './funds.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsComponent implements OnInit {
  protected readonly fundService = inject(FundService);
  protected readonly userService = inject(UserService);

  protected readonly selectedFund = signal<IFund | null>(null);

  ngOnInit(): void {
    this.fundService.loadFunds().subscribe();
  }

  protected openSubscribeDialog(fund: IFund): void {
    this.selectedFund.set(fund);
  }

  protected closeSubscribeDialog(): void {
    this.selectedFund.set(null);
  }

  protected handleSubscribe(event: {
    fund: IFund;
    method: NotificationMethod;
    amount?: number;
  }): void {
    this.userService
      .subscribeTo(event.fund, {
        fundId: event.fund.id,
        amount: event.amount ?? event.fund.minimumAmount,
        notificationMethod: event.method,
      })
      .subscribe((success) => {
        if (success) {
          this.closeSubscribeDialog();
        }
      });
  }
}
