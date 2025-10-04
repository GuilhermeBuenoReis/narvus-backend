import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { env } from '../config/env';

export const auth = betterAuth({
  trustedOrigins: [env.CLIENT_ORIGIN],
  plugins: [
    openAPI({
      path: '/api/auth/reference',
      disableDefaultReference: false,
    }),
  ],
});
