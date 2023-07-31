// /*!
//  * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
//  * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
//  *
//  * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  *
//  * See the License for the specific language governing permissions and limitations under the License.
//  */

import { Component, OnInit } from '@angular/core';
// import { OktaAuthService } from '@okta/okta-angular';
// import * as OktaSignIn from '@okta/okta-signin-widget';
// import sampleConfig from '../app.config';
// import { GlobalService } from './../services/global.service';
// import { Router } from '@angular/router';
// const DEFAULT_ORIGINAL_URI = window.location.origin;

// let USE_INTERACTION_CODE = false;
// if (sampleConfig.oidc.useInteractionCodeFlow === 'true') {
//   USE_INTERACTION_CODE = true;
// }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
//   signIn: any;
//   bannerImage:any;
//   constructor(public oktaAuth: OktaAuthService,private globalService: GlobalService, private router: Router) {
//     this.signIn = new OktaSignIn({
//       /**
//        * Note: when using the Sign-In Widget for an OIDC flow, it still
//        * needs to be configured with the base URL for your Okta Org. Here
//        * we derive it from the given issuer for convenience.
//        */
//       baseUrl: sampleConfig.oidc.issuer.split('/oauth2')[0],
//       clientId: sampleConfig.oidc.clientId,
//       redirectUri: sampleConfig.oidc.redirectUri,


//       // i18n: {

//       // },
//       authParams: {
//         issuer: sampleConfig.oidc.issuer,
//         scopes: sampleConfig.oidc.scopes
//       },
//       useInteractionCodeFlow: USE_INTERACTION_CODE,
//     });

//   }

   ngOnInit() {
//     // When navigating to a protected route, the route path will be saved as the `originalUri`
//     // If no `originalUri` has been saved, then redirect back to the app root
//     const originalUri = this.oktaAuth.getOriginalUri();
//     this.bannerImage = this.globalService.configObj.bannerImages.dashboardPage;
//     if (!originalUri || originalUri === DEFAULT_ORIGINAL_URI) {
//       this.oktaAuth.setOriginalUri('/dashboard');
     }

//     this.signIn.showSignInToGetTokens({
//       el: '#sign-in-widget',
//       scopes: sampleConfig.oidc.scopes
//     }).then(tokens => {
//       // Remove the widget
//       this.signIn.remove();

//       // In this flow the redirect to Okta occurs in a hidden iframe
//        this.oktaAuth.handleLoginRedirect(tokens);
//        const base64 = require('base64url');
//        let JWT_BASE64_URL =tokens.idToken.idToken;

//       const jwtParts = JWT_BASE64_URL.split('.');
// const headerInBase64UrlFormat = jwtParts[0];
// const payloadInBase64UrlFormat = jwtParts[1];
// const signatureInBase64UrlFormat = jwtParts[2];

// const decodedHeader = base64.decode(headerInBase64UrlFormat);
// const decodedPayload = base64.decode(payloadInBase64UrlFormat);
// const decodedSignature = base64.decode(signatureInBase64UrlFormat);


//     }).catch(err => {
//       // Typically due to misconfiguration
//       throw err;
//     });
//   }

// toDashboard(){
// this.router.navigateByUrl('/dashboard')
// }

}