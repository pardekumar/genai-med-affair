import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component( {
  selector: 'app-footer, [app-footer]',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.css' ]
} )
export class FooterComponent implements OnInit {

  webLink: any;
  constructor ( public globalService: GlobalService ) { }

  ngOnInit (): void {
    this.webLink = this.globalService.configObj?.footerLink;
  }


}
