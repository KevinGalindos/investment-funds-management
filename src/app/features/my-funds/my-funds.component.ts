import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ISubscription } from '../../core/interfaces';
import { ActionDialogComponent } from '../../shared/components/action-dialog/action-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { FundService } from '../../core/services/fund.service';

import { MyFundsSummaryComponent } from './components/my-funds-summary/my-funds-summary.component';
import { MyFundsListComponent } from './components/my-funds-list/my-funds-list.component';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-my-funds',
  standalone: true,
  imports: [
    CommonModule,
    ActionDialogComponent,
    LoadingSpinnerComponent,
    MyFundsSummaryComponent,
    MyFundsListComponent,
  ],
  templateUrl: './my-funds.component.html',
  styleUrl: './my-funds.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFundsComponent implements OnInit {
  protected readonly userService = inject(UserService);
  protected readonly fundService = inject(FundService);

  protected readonly showCancelDialog = signal(false);
  private subscriptionToCancel: ISubscription | null = null;

  ngOnInit(): void {
    this.userService.loadUser().subscribe();
    this.fundService.loadFunds().subscribe();
  }

  protected getFundCategory(fundId: number): 'FPV' | 'FIC' | null {
    const fund = this.fundService.getFundById(fundId);
    return fund?.category ?? null;
  }

  protected cancelDialogMessage(): string {
    if (!this.subscriptionToCancel) return '';
    return (
      `Se cancelará su suscripción al fondo ${this.subscriptionToCancel.fundName} ` +
      `y se reintegrarán COP $${this.subscriptionToCancel.amount.toLocaleString('es-CO')} a su saldo.`
    );
  }

  protected confirmCancel(sub: ISubscription): void {
    this.subscriptionToCancel = sub;
    this.showCancelDialog.set(true);
  }

  protected onCancelConfirmed(): void {
    if (this.subscriptionToCancel) {
      this.userService.cancelSubscription(this.subscriptionToCancel.fundId).subscribe(() => {
        this.closeCancelDialog();
      });
    }
  }

  protected closeCancelDialog(): void {
    this.showCancelDialog.set(false);
    this.subscriptionToCancel = null;
  }
}
