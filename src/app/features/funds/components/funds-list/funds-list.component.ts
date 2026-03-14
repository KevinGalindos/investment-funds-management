import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { FundService } from '../../../../core/services/fund.service';
import { UserService } from '../../../../core/services/user.service';
import { IFund } from '../../../../core/interfaces';
import { FundCardComponent } from '../fund-card/fund-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-funds-list',
  standalone: true,
  imports: [FundCardComponent, LoadingSpinnerComponent],
  templateUrl: './funds-list.component.html',
  styleUrl: './funds-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsListComponent {
  protected readonly fundService = inject(FundService);
  protected readonly userService = inject(UserService);

  readonly subscribeFund = output<IFund>();

  protected loadFunds(): void {
    this.fundService.loadFunds().subscribe();
  }
}
