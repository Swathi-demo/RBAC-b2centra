const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');
require('dotenv').config();

// Azure AD B2C Strategy
const b2cConfig = {
  identityMetadata: `https://${process.env.B2C_TENANT_NAME}.b2clogin.com/${process.env.B2C_TENANT_NAME}.onmicrosoft.com/${process.env.B2C_POLICY}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.B2C_CLIENT_ID,
  responseType: 'code id_token',
  responseMode: 'form_post',
  redirectUrl: process.env.B2C_REDIRECT_URL,
  allowHttpForRedirectUrl: true,
  clientSecret: process.env.B2C_CLIENT_SECRET,
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['openid', 'profile', 'email'],
};

passport.use(
  'b2c',
  new OIDCStrategy(b2cConfig, (issuer, subject, profile, accessToken, refreshToken, done) => {
    if (!profile) return done(new Error('No user profile found'));
    const user = {
      id: profile.oid,
      displayName: profile.displayName,
      email: profile.emails[0],
    };
    return done(null, user);
  })
);

// Entra ID Strategy
const entraConfig = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.ENTRA_CLIENT_ID,
  responseType: 'code id_token',
  responseMode: 'form_post',
  redirectUrl: process.env.ENTRA_REDIRECT_URL,
  allowHttpForRedirectUrl: true,
  clientSecret: process.env.ENTRA_CLIENT_SECRET,
  validateIssuer: true,
  passReqToCallback: false,
  scope: ['openid', 'profile', 'email'],
};

passport.use(
  'entra',
  new OIDCStrategy(entraConfig, (issuer, subject, profile, accessToken, refreshToken, done) => {
    if (!profile) return done(new Error('No user profile found'));
    const user = {
      id: profile.oid,
      displayName: profile.displayName,
      email: profile.emails[0],
    };
    return done(null, user);
  })
);

// Serialize and Deserialize Users
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
