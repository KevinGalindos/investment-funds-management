import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { UserService } from './core/services/user.service';
import { FundService } from './core/services/fund.service';
import { TransactionService } from './core/services/transaction.service';

/**
 * Componente raíz de la aplicación.
 * Inicializa los datos del usuario, fondos y transacciones al arrancar.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout />`,
})
export class App implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fundService = inject(FundService);
  private readonly transactionService = inject(TransactionService);

  /**
   * Carga inicial de todos los datos necesarios.
   */
  ngOnInit(): void {
    this.userService.loadUser().subscribe();
    this.fundService.loadFunds().subscribe();
    this.transactionService.loadTransactions().subscribe();
  }
}
