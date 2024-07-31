import { ENV } from '@app/config/env';

export const environment = {
  production: true,

  ...ENV.dev,
};
