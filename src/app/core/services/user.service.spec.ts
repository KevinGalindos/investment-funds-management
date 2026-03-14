import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { TransactionService } from './transaction.service';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';
import { IUser, IFund, ISubscriptionRequest } from '../interfaces';
import { API_CONFIG } from '../constants/config.constants';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let transactionServiceSpy: any;
  let toastServiceSpy: any;
  let notificationServiceSpy: any;

  const mockUser: IUser = {
    id: 1,
    name: 'Kevin',
    email: 'kevin@test.com',
    phone: '123456',
    balance: 500000,
    subscribedFunds: []
  };

  const mockFund: IFund = {
    id: 1,
    name: 'Test Fund',
    minimumAmount: 75000,
    category: 'FPV'
  };

  beforeEach(() => {
    transactionServiceSpy = {
      addTransaction: vi.fn().mockReturnValue(of({}))
    };
    toastServiceSpy = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };
    notificationServiceSpy = {
      sendNotification: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user data and update signals', () => {
    service.loadUser().subscribe(user => {
      expect(user.name).toBe('Kevin');
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`);
    req.flush(mockUser);

    expect(service.user()?.name).toBe('Kevin');
    expect(service.balance()).toBe(500000);
  });

  describe('subscribeTo', () => {
    beforeEach(() => {
      // Load user first for subscription tests
      service.loadUser().subscribe();
      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`);
      req.flush(mockUser);
    });

    it('should validate minimum amount', () => {
      const request: ISubscriptionRequest = { fundId: 1, amount: 50000, notificationMethod: 'email' };
      service.subscribeTo(mockFund, request).subscribe(success => {
        expect(success).toBe(false);
        expect(toastServiceSpy.error).toHaveBeenCalled();
      });
    });

    it('should validate sufficient balance', () => {
      const request: ISubscriptionRequest = { fundId: 1, amount: 600000, notificationMethod: 'email' };
      service.subscribeTo(mockFund, request).subscribe(success => {
        expect(success).toBe(false);
        expect(toastServiceSpy.error).toHaveBeenCalledWith(expect.stringMatching(/saldo suficiente/i));
      });
    });

    it('should complete subscription successfully', () => {
      const request: ISubscriptionRequest = { fundId: 1, amount: 100000, notificationMethod: 'email' };
      
      service.subscribeTo(mockFund, request).subscribe(success => {
        expect(success).toBe(true);
      });

      const putReq = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`);
      expect(putReq.request.method).toBe('PUT');
      expect(putReq.request.body.balance).toBe(400000);
      putReq.flush({ ...mockUser, balance: 400000 });

      expect(transactionServiceSpy.addTransaction).toHaveBeenCalled();
      expect(notificationServiceSpy.sendNotification).toHaveBeenCalled();
      expect(toastServiceSpy.success).toHaveBeenCalled();
    });
  });

  describe('cancelSubscription', () => {
    it('should return false if fund is not found', () => {
      service.loadUser().subscribe();
      httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`).flush(mockUser);

      service.cancelSubscription(99).subscribe(success => {
        expect(success).toBe(false);
        expect(toastServiceSpy.warning).toHaveBeenCalled();
      });
    });
  });
});
