import { environment } from '../environments/environment';
const OKTA_TESTING_DISABLEHTTPSCHECK = true;
const CLIENT_ID = environment.clientId;
const ISSUER = environment.issuer;
const REDIRECT_URI = environment.redirectUri;
const USE_INTERACTION_CODE = false;

export default {
  oidc: {
    clientId: `${CLIENT_ID}`,
    issuer: `${ISSUER}`,
    redirectUri: `${REDIRECT_URI}`,
    scopes: ['openid', 'profile', 'email'],
    testing: {
      disableHttpsCheck: `${OKTA_TESTING_DISABLEHTTPSCHECK}`
    },
    useInteractionCodeFlow: `${USE_INTERACTION_CODE}`,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};

