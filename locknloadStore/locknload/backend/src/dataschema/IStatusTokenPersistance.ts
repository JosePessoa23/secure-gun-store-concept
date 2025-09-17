export interface IStatusTokenPersistence {
    _id: string;
    email: string;
    token: string;
    expiresAt: Date;
  }
  