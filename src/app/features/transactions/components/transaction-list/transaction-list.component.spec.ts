import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionService } from '../../../../core/services/transaction.service';
import { signal } from '@angular/core';
import { ITransaction } from '../../../../core/interfaces';
import { DatePipe } from '@angular/common';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let mockTransactionService: any;

  const mockTransactions: ITransaction[] = [
    {
      id: '1',
      fundId: 1,
      fundName: 'Fondo A',
      type: 'subscribe',
      amount: 100000,
      date: new Date().toISOString(),
      notificationMethod: 'email'
    }
  ];

  beforeEach(async () => {
    mockTransactionService = {
      loading: signal(false),
      transactions: signal(mockTransactions)
    };

    await TestBed.configureTestingModule({
      imports: [TransactionListComponent, DatePipe, CopCurrencyPipe],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('transactions', mockTransactions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render transaction fund name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Look in both desktop table and mobile list
    const content = compiled.textContent || '';
    expect(content).toContain('Fondo A');
  });

  it('should show empty state when no transactions provided', () => {
    fixture.componentRef.setInput('transactions', []);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.querySelector('h3')?.textContent).toContain('Sin transacciones');
  });

  it('should show loading spinner when service is loading', () => {
    mockTransactionService.loading.set(true);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loading-spinner')).toBeTruthy();
  });
});
