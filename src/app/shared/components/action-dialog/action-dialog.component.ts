import {
  Component,
  input,
  output,
  signal,
  inject,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { IFund, NotificationMethod } from '../../../core/interfaces';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';
import { API_CONFIG } from '../../../core/constants/config.constants';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [FormsModule, CopCurrencyPipe],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDialogComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      const f = this.fund();
      if (f) {
        this.investmentAmount.set(f.minimumAmount);
        this.displayAmount.set(this.formatNumber(f.minimumAmount));
      }
    });
  }

  ngOnInit(): void {
    this.renderer.appendChild(this.document.body, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    const nativeElement = this.el.nativeElement;
    if (nativeElement && nativeElement.parentNode) {
      this.renderer.removeChild(nativeElement.parentNode, nativeElement);
    }
  }

  readonly dialogType = input<'subscribe' | 'confirm'>('confirm');
  readonly visible = input<boolean>(false);
  readonly maxWidth = input<string>('sm:max-w-lg');

  readonly closed = output<void>();

  readonly title = input<string>('Confirmar Acción');
  readonly message = input<string>('');
  readonly icon = input<string>('ℹ️');
  readonly confirmText = input<string>('Confirmar');
  readonly cancelText = input<string>('Cancelar');
  readonly type = input<'primary' | 'danger'>('primary');

  readonly confirmed = output<void>();

  readonly fund = input<IFund | null>(null);
  readonly subscribed = output<{ fund: IFund; method: NotificationMethod; amount: number }>();

  protected readonly isClosing = signal(false);
  protected readonly isEntered = signal(false);
  protected readonly selectedMethod = signal<NotificationMethod>('email');
  protected readonly investmentAmount = signal<number>(0);
  protected readonly displayAmount = signal<string>('');

  protected readonly amountTooLow = computed(() => {
    const f = this.fund();
    return f !== null && this.investmentAmount() < f.minimumAmount;
  });

  protected readonly amountTooHigh = computed(() => {
    return this.investmentAmount() > this.userService.balance();
  });

  protected readonly userService = inject(UserService);

  public closeDialog(): void {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isClosing.set(false);
      this.isEntered.set(false);
      this.closed.emit();
    }, API_CONFIG.ANIMATIONS.DIALOG_CLOSE_MS);
  }

  protected onBackdropClick(): void {
    this.closeDialog();
  }

  protected onBodyClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onConfirmAction(): void {
    this.confirmed.emit();
    this.closeDialog();
  }

  protected onSubscribeAction(): void {
    const f = this.fund();
    if (f && !this.amountTooLow() && !this.amountTooHigh()) {
      this.subscribed.emit({
        fund: f,
        method: this.selectedMethod(),
        amount: this.investmentAmount(),
      });
      this.closeDialog();
    }
  }

  protected onCancelAction(): void {
    this.closeDialog();
  }

  protected onAmountInput(value: string): void {
    const numericValue = value.replace(/\D/g, '');
    const num = parseInt(numericValue, 10) || 0;

    this.investmentAmount.set(num);
    const formatted = this.formatNumber(num);
    this.displayAmount.set(formatted);
  }

  private readonly numberFormatter = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  private formatNumber(value: number): string {
    if (value === 0) return '';
    return this.numberFormatter.format(value);
  }
}
