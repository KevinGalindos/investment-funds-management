import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { UserService } from './core/services/user.service';
import { FundService } from './core/services/fund.service';
import { TransactionService } from './core/services/transaction.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let mockUserService: any;
  let mockFundService: any;
  let mockTransactionService: any;

  beforeEach(async () => {
    mockUserService = { loadUser: vi.fn().mockReturnValue(of({})) };
    mockFundService = { loadFunds: vi.fn().mockReturnValue(of({})) };
    mockTransactionService = { loadTransactions: vi.fn().mockReturnValue(of({})) };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: mockUserService },
        { provide: FundService, useValue: mockFundService },
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
