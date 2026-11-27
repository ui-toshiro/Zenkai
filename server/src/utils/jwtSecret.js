import crypto from 'crypto';

let ephemeralDevSecret = null;

/**
 * Returns the JWT signing secret from environment variables.
 * Throws in production if unset; generates an ephemeral random secret in development.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim().length > 0) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is not defined in production!');
  }

  if (!ephemeralDevSecret) {
    ephemeralDevSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[SECURITY WARNING] JWT_SECRET not set. Using ephemeral random secret for this dev session.');
  }

  return ephemeralDevSecret;
};
