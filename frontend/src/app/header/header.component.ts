import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';


@Component( {
  selector: 'app-header,[app-header]',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
} )
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;
  constructor ( public oktaAuth: OktaAuthService,private router:Router ) {
    this.oktaAuth.$authenticationState.subscribe( isAuthenticated => this.isAuthenticated = isAuthenticated );
  }

  async ngOnInit () {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }


}
