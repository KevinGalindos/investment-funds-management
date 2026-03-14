import { NotificationMethod } from './transaction.interface';

export interface ISubscription {
  fundId: number;
  fundName: string;
  amount: number;
  notificationMethod: NotificationMethod;
  subscribedAt: string;
}

export interface ISubscriptionRequest {
  fundId: number;
  amount: number;
  notificationMethod: NotificationMethod;
}
