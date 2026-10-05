//Shared JWT settings for signing (login) and verifying (protect middleware).
//The fallback secret is for local development only; production must set JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-only-insecure-jwt-secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
}
if (!process.env.JWT_SECRET) {
    console.warn('⚠️JWT_SECRET is not set, using an insecure development fallback');
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
