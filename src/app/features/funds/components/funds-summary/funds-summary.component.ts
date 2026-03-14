import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FundService } from '../../../../core/services/fund.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-funds-summary',
  standalone: true,
  templateUrl: './funds-summary.component.html',
  styleUrl: './funds-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundsSummaryComponent {
  protected readonly fundService = inject(FundService);
  protected readonly userService = inject(UserService);
}
