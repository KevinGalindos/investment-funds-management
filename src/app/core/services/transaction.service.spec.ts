import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { ITransaction } from '../interfaces';
import { API_CONFIG } from '../constants/config.constants';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService],
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load and sort transactions by date (descending)', () => {
    const mockTransactions: ITransaction[] = [
      {
        id: '1',
        fundId: 1,
        fundName: 'A',
        type: 'subscribe',
        amount: 100,
        date: '2026-01-01',
        notificationMethod: 'email',
      },
      {
        id: '2',
        fundId: 2,
        fundName: 'B',
        type: 'cancel',
        amount: 200,
        date: '2026-01-02',
        notificationMethod: 'sms',
      },
    ];

    service.loadTransactions().subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);

    // Signal holds the sorted state — most recent first
    expect(service.transactions().length).toBe(2);
    expect(service.transactions()[0].id).toBe('2');
  });

  it('should add a transaction and update local signal', () => {
    const newTx: ITransaction = {
      id: 'generated-id',
      fundId: 3,
      fundName: 'C',
      type: 'subscribe',
      amount: 300,
      date: new Date().toISOString(),
      notificationMethod: 'email',
    };

    service.addTransaction(3, 'C', 'subscribe', 300, 'email').subscribe();

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`);
    expect(req.request.method).toBe('POST');
    req.flush(newTx);

    expect(service.transactions().length).toBe(1);
    expect(service.transactions()[0].fundId).toBe(3);
  });

  it('should calculate total subscriptions and cancellations correctly', () => {
    const mockTransactions: ITransaction[] = [
      {
        id: '1',
        fundId: 1,
        fundName: 'A',
        type: 'subscribe',
        amount: 100,
        date: '2026-01-01',
        notificationMethod: 'email',
      },
      {
        id: '2',
        fundId: 1,
        fundName: 'A',
        type: 'subscribe',
        amount: 200,
        date: '2026-01-02',
        notificationMethod: 'email',
      },
      {
        id: '3',
        fundId: 2,
        fundName: 'B',
        type: 'cancel',
        amount: 150,
        date: '2026-01-03',
        notificationMethod: 'sms',
      },
    ];

    service.loadTransactions().subscribe();
    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`);
    req.flush(mockTransactions);

    expect(service.totalSubscriptions()).toBe(2);
    expect(service.totalCancellations()).toBe(1);
  });
});
