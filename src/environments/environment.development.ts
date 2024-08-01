import { ENV } from '@app/config/env';

export const environment = {
  production: false,

  ...ENV.dev,
};
