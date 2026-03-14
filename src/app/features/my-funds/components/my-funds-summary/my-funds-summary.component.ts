import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-my-funds-summary',
  standalone: true,
  imports: [CopCurrencyPipe],
  templateUrl: './my-funds-summary.component.html',
  styleUrl: './my-funds-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFundsSummaryComponent {
  protected readonly userService = inject(UserService);
}
