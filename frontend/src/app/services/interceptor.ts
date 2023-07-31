// loader-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { Router } from '@angular/router';
import * as configData from '../../config/appData-config.json';
import { OktaAuthService } from '@okta/okta-angular';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  configObj: any = (configData as any).default;
  isAuthenticated: boolean
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService, public oktaAuth: OktaAuthService, private router: Router,) {
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.requests.push(req);



    this.loaderService.isLoading.next(true);
    return Observable.create(observer => {
      const subscription = next.handle(req)
        .subscribe(
          eve => {
            if (eve instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(eve);
            }

          },
          err => {
            if (err.status === 500) {
              alert(this.configObj.serverErrorMsg);
            }

            else if (err.status === 403) {
              alert(this.configObj.SessionExpiredMsg)
              //this.oktaAuth.signOut('http://localhost:8080');
              //this.router.navigateByUrl('/login')
              //window.location.reload()
              localStorage.removeItem('okta-cache-storage');
              localStorage.removeItem('okta-token-storage');
              localStorage.removeItem('okta-pkce-storage');
            }
            else if (err.status === 400) {

            }
            else {

              alert(this.configObj.ForRemaningErrorMsg)
            }

            this.removeRequest(req);
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
