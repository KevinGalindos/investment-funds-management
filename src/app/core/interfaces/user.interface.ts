import type { ISubscription } from './subscription.interface';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  subscribedFunds: ISubscription[];
}
