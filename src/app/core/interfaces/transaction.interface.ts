export type NotificationMethod = 'email' | 'sms';

export type TransactionType = 'subscribe' | 'cancel';

export interface ITransaction {
  id: string;
  fundId: number;
  fundName: string;
  type: TransactionType;
  amount: number;
  date: string;
  notificationMethod: NotificationMethod;
}
