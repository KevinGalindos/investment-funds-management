import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    USER: '/user',
    FUNDS: '/funds',
    TRANSACTIONS: '/transactions',
  },
  ANIMATIONS: {
    DIALOG_CLOSE_MS: 200,
    ACTION_EMIT_MS: 250,
  },
  TOAST: {
    DEFAULT_DURATION_MS: 3000,
    SUCCESS_DURATION_MS: 4000,
    ERROR_DURATION_MS: 5000,
    WARNING_DURATION_MS: 4500,
    INFO_DURATION_MS: 3500,
  },
} as const;
